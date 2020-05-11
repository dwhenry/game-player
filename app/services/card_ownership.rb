class CardOwnership
  attr_reader :game, :user, :error_message, :error_code

  def self.build(game:, user:, object_id:)
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

  def initialize(game:, user:)
    @game = game
    @user = user
    @error_message = "An error occured"
    @error_code = ErrorCodes::UNKNOWN_ERROR
  end

  def error(code, message)
    @error_code = code
    @error_message = message
    false
  end

  class CardActions < CardOwnership
    attr_reader :card_id

    def initialize(game:, user:, card_id:)
      super(game: game, user: user)
      @card_id = card_id
    end

    def move(location_id:, stack:)
      card = game.card_objects.find(card_id)
      if card.owner_id == user
      else
        GameLogger.new(game: game, user: user, card_name: card_name(card)).failed_move_to(location_id: location_id, stack: stack)
        error(ErrorCodes::NOT_YOUR_CARD, "not your card to move")
      end
    end

    def card_name(card)
      # TODO: cache this to avoid lookup as it need to deserialize the JSON hash each time
      card_name = nil
      game.game_config.decks.each do |_, cards|
        card_name ||= cards.dig(card.card_id, "name")
      end
      card_name || raise("Invalid card")
    end


    def take
      game.card_objects.where(owner_id: user).update_all(owner_id: nil)

      game.transaction do
        card = game.card_objects.lock("FOR UPDATE NOWAIT").find_by(id: card_id, owner_id: nil)

        return error(ErrorCodes::FAILED_TO_TAKE_CARD, "Failed to take ownership of card") unless card

        card.update!(owner_id: user)
      end
    rescue ActiveRecord::LockWaitTimeout
      error(ErrorCodes::FAILED_TO_TAKE_CARD, "Failed to take ownership of card")
    end
  end

  class LocationActions < CardOwnership
    attr_reader :game, :user, :location_id, :stack

    def initialize(game:, user:, location_id:, stack:)
      super(game: game, user: user)
      @location_id = location_id
      @stack = stack
    end

    def take
      game.card_objects.where(owner_id: user).update_all(owner_id: nil)

      game.transaction do
        card = game.card_objects.order(last_move_id: :desc).lock("FOR UPDATE SKIP LOCKED").find_by(location_id: location_id, stack: stack, owner_id: nil)

        return error(ErrorCodes::FAILED_TO_TAKE_CARD, "Failed to take ownership of card") unless card

        card.update!(owner_id: user)
      end
    rescue ActiveRecord::LockWaitTimeout
      error(ErrorCodes::FAILED_TO_TAKE_CARD, "Failed to take ownership of card")
    end
  end
end
