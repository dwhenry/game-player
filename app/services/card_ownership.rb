class CardOwnership
  attr_reader :game, :user

  def initialize(game:, user:)
    @game = game
    @user = user
  end

  def take(object_id)
    # release any other cards you currently own...
    game.card_objects.where(owner_id: user).update_all(owner_id: nil)

    actions_for(object_id).take
  rescue ActiveRecord::LockWaitTimeout
    false
  end

  def actions_for(object_id)
    type, id_or_location_id, stack, _unqiue_id = object_id.split(":")

    case type
    when "card"
      CardActions.new(game: game, user: user, card_id: id_or_location_id)
    when "location"
      LocationActions.new(game: game, user: user, location_id: id_or_location_id, stack: stack)
    else
      raise "Invalid object type"
    end
  end

  class CardActions
    attr_reader :game, :user, :card_id

    def initialize(game:, user:, card_id:)
      @game = game
      @user = user
      @card_id = card_id
    end

    def take
      game.transaction do
        card = game.card_objects.lock("FOR UPDATE NOWAIT").find_by(id: card_id, owner_id: nil)

        return false unless card

        card.update!(owner_id: user)
      end
    end
  end

  class LocationActions
    attr_reader :game, :user, :location_id, :stack

    def initialize(game:, user:, location_id:, stack:)
      @game = game
      @user = user
      @location_id = location_id
      @stack = stack
    end

    def take
      game.transaction do
        card = game.card_objects.order(last_move_id: :desc).lock("FOR UPDATE SKIP LOCKED").find_by(location_id: location_id, stack: stack, owner_id: nil)

        return false unless card

        card.update!(owner_id: user)
      end
    end
  end
end
