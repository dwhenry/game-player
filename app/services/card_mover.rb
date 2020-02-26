class CardMover
  STACK_NAMES = %w[fu board employees hand].freeze
  TOP_ONLY_STACK_NAMES = %w[backlog pile discard ].freeze

  attr_reader :game, :card_id, :location_name, :stack_name, :action_id

  def initialize(game, options)
    @game = game

    @card_id = options['id']
    @location_name = options['location']
    @stack_name = options['stack']
    @action_id = options['action_id']

    @errors = []
  end

  def call
    game.with_lock do
      return error('invalid_action') if game.next_action != action_id

      game.next_action = SecureRandom.uuid
      return error('Invalid Location') unless new_stack

      card = find_card
      return error('Invalid Card') unless card

      new_stack << card
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
