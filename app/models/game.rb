class Game < ApplicationRecord
  belongs_to :game_config

  def player_stacks(status: 'all')
    cards.select do |stack|
      stack['type'] == 'player' && ['all', stack['status']].include?(status)
    end
  end

  def deck_stacks
    cards.select { |stack| stack['type'] == 'deck' }
  end
end
