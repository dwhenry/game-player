class Card < ApplicationRecord
  belongs_to :game

  validates :identity, uniqueness: { scope: :game_id }
  validates :last_move_id, uniqueness: { scope: :game_id }
end
