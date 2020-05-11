class Card < ApplicationRecord
  belongs_to :game

  validates :last_move_id, uniqueness: { scope: :game_id }
end
