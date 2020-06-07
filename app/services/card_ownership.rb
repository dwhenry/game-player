class CardOwnership
  attr_reader :game, :user, :location_id, :stack, :error_message, :error_code, :logger

  def self.build(game:, user:, object_locator:)
    type, location_id, stack, id = object_locator.split(":")

    case type
    when "card"
      CardActions.new(game: game, user: user, object_locator: object_locator, location_id: location_id, stack: stack, card_id: id)
    when "location"
      LocationActions.new(game: game, user: user, object_locator: object_locator, location_id: location_id, stack: stack)
    else
      raise "Invalid object type"
    end
  end

  def initialize(game:, user:, location_id:, stack:)
    @game = game
    @user = user
    @location_id = location_id
    @stack = stack
    @error_message = "An error occured"
    @error_code = ErrorCodes::UNKNOWN_ERROR
  end

  def error(code, message)
    @error_code = code
    @error_message = message
    false
  end

  def release_other_cards
    game.card_objects.where(owner_id: user).each do |card|
      card.update!(owner_id: nil)
      logger.return_card(location_id: card.location_id, stack: card.stack)
    end
  end

  class CardActions < CardOwnership
    attr_reader :card_id, :card

    def initialize(game:, user:, object_locator:, card_id:, location_id:, stack:)
      super(game: game, user: user, location_id: location_id, stack: stack)
      @card_id = card_id
      @card = game.card_objects.find(card_id)
      @logger = GameLogger.new(game: game, user: user, card_name: card_name(card), object_locator: object_locator)
    end

    def move(to_location_id:, to_stack:)
      if card.owner_id == user
        card.transaction do
          card.update!(
            owner_id: nil,
            location_id: to_location_id,
            stack: to_stack
          )
          logger.move(location_id: to_location_id, stack: to_stack, card_id: card.id)
        end
        card
      else
        logger.failed_move_to(location_id: to_location_id, stack: to_stack)
        error(ErrorCodes::NOT_YOUR_CARD, "not your card to move")
      end
    end

    def take
      release_other_cards

      begin
        game.transaction do
          card = game.card_objects.lock("FOR UPDATE NOWAIT").find_by(id: card_id, owner_id: nil)

          if card && card.location_id == location_id && card.stack == stack
            card.update!(owner_id: user)
            logger.pickup_card(location_id: card.location_id, stack: card.stack)
            return true
          end
        end
      rescue ActiveRecord::LockWaitTimeout
      end
      # only get here on failure - avoid repeating this lookup??
      card ||= game.card_objects.find(card_id)
      logger.failed_pickup(location_id: card.location_id, stack: card.stack)
      error(ErrorCodes::FAILED_TO_TAKE_CARD, "Failed to take ownership of card")
    end

    private

    def card_name(card)
      # TODO: cache this to avoid lookup as it need to deserialize the JSON hash each time
      card_name = nil
      game.game_config.decks.each do |_, cards|
        card_name ||= cards.dig(card.card_id, "name")
      end
      card_name || raise("Invalid card")
    end
  end

  class LocationActions < CardOwnership
    attr_reader :game, :user, :location_id, :stack

    def initialize(game:, user:, object_locator:, location_id:, stack:)
      super(game: game, user: user, location_id: location_id, stack: stack)
      @logger = GameLogger.new(game: game, user: user, card_name: "#{location_id} (#{stack})", object_locator: object_locator)
    end

    def move(to_location_id:, to_stack:)
      card = game.card_objects.lock("FOR UPDATE NOWAIT").find_by!(location_id: location_id, stack: stack, owner_id: user)
      card.transaction do
        card.update!(
          owner_id: nil,
          location_id: to_location_id,
          stack: to_stack
        )
        logger.move(location_id: to_location_id, stack: to_stack, card_id: card.id)
      end
      card
    rescue ActiveRecord::LockWaitTimeout, ActiveRecord::RecordNotFound
      logger.failed_move_to(location_id: to_location_id, stack: to_stack)
      error(ErrorCodes::NOT_YOUR_CARD, "not your card to move")
    end

    def take
      release_other_cards

      game.transaction do
        card = game.card_objects.order(last_move_id: :desc).lock("FOR UPDATE SKIP LOCKED").find_by(location_id: location_id, stack: stack, owner_id: nil)

        return error(ErrorCodes::FAILED_TO_TAKE_CARD, "Failed to take ownership of card") unless card

        card.update!(owner_id: user)
        logger.pickup_location(location_id: card.location_id, stack: card.stack)
        return true
      end
    rescue ActiveRecord::LockWaitTimeout
      error(ErrorCodes::FAILED_TO_TAKE_CARD, "Failed to take ownership of card")
    end
  end
end
