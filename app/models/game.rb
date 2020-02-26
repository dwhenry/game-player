class Game < ApplicationRecord
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
end
