class UserLog < ApplicationRecord
  belongs_to :game

  validates :game_id, presence: true
  validates :user, uniqueness: { scope: :game_id }
end
