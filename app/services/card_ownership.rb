class CardOwnership
  attr_reader :game, :user

  def initialize(game:, user:)
    @game = game
    @user = user
  end

  def take(object_id)
    actions_for(object_id).take
  rescue ActiveRecord::LockWaitTimeout
    false
  end

  def actions_for(object_id)
    type, id_or_location, stack, _id = object_id.split(":")

    case type
    when "card"
      CardActions.new(game: game, user: user, card_id: id_or_location)
    when "location"
      LocationActions.new(game: game, user: user, location: id_or_location, stack: stack)
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
        # binding.pry
        # release any other cards you currently own...
        game.card_objects.where(owner_id: user).where.not(identity: card_id).update_all(owner_id: nil)

        Rails.logger.info 'wait for lock'
        card = game.card_objects.lock("FOR UPDATE NOWAIT").find_by(identity: card_id, owner_id: nil)
        Rails.logger.info 'has lock'

        return false unless card
        Rails.logger.info 'doig  update'

        card.update!(owner_id: user)
      end
    end
  end

  class Locationactions

  end
end
