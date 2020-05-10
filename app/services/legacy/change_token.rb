class ChangeToken
  attr_reader :game, :player_id, :token_type, :changed, :action_id

  def initialize(game, token, action_id)
    @game = game
    @action_id = action_id

    @player_id = token[:player_id]
    @token_type = token[:tokenType]
    @changed = token[:changed].to_i

    @errors = []
  end

  def call
    game.with_lock do
      return error('invalid_action') if game.next_action != action_id

      game.next_action = SecureRandom.uuid

      player_deck = game.cards.detect { |deck| deck['id'] == player_id && deck['type'] == 'player'}
      return error('Invalid player') unless player_deck

      return error("Invalid token type: #{token_type}") unless player_deck['tokens'][token_type]

      player_deck['tokens'][token_type] += changed
      return if game.save

      error('Invalid Save')
    end
  end

  def error(error = nil)
    @errors << error if error
    @errors.join(', ')
  end

  def find_card
    game.cards.each do |search_location|
      TOP_ONLY_STACK_NAMES.each do |stack_name|
        stack = search_location[stack_name]

        return stack.pop if stack&.last&.first == card_id # first element of the last row
      end

      STACK_NAMES.each do |stack_name|
        stack = search_location[stack_name]
        card = stack&.detect { |id, _| id == card_id }

        next unless card

        return stack.delete(card)
      end
    end

    nil
  end

  def new_stack
    @new_stack ||= begin
      location = game.cards.detect { |stack| stack['id'] == location_name }
      location && location[stack_name]
    end
  end
end
