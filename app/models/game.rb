class Game < ApplicationRecord
  STACK_NAMES = %w[fu board employees hand].freeze
  TOP_ONLY_STACK_NAMES = %w[backlog pile discard ].freeze

  belongs_to :game_config

  def player_stacks(status: 'all')
    cards.select do |stack|
      stack['type'] == 'player' && ['all', 'active', stack['status']].include?(status) && (status != 'active' || stack['status'] != 'pending')
    end
  end

  def deck_stacks
    cards.select { |stack| stack['type'] == 'deck' }
  end

  def join(username)
    return if player_stacks.any? { |stack| stack['id'] == username }

    stack = player_stacks(status: 'pending').first
    stack['status'] = 'starting'
    stack['id'] = username
    save!
  end

  def move_card(options)
    card_id = options['id']
    location_name = options['location']
    stack_name = options['stack']

    # check that destination exists
    location = cards.detect { |stack| stack['id'] == location_name }
    return 'Invalid Location' unless location && location[stack_name]

    # find and remove the card from it's existing location
    card = nil

    cards.each do |search_location|
      STACK_NAMES.each do |search_stack_name|
        next unless search_location[search_stack_name]

        card = search_location[search_stack_name].detect { |id, _| id == card_id }

        next unless card

        search_location[search_stack_name].delete(card)
        location[stack_name] << card

        break
      end
      break if card

      TOP_ONLY_STACK_NAMES.each do |search_stack_name|
        next unless search_location[search_stack_name]

        next unless search_location[search_stack_name].last && search_location[search_stack_name].last[0] == card_id

        card = search_location[search_stack_name].pop
        location[stack_name] << card

        break
      end
      break if card
    end

    return 'Invalid Card' unless card

    return nil if save

    'Invalid Save'
  end
end
