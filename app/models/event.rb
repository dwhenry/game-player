class Event < ApplicationRecord
  EVENT_TYPES = [
    FAILED_MOVE = "failed_move",
    FAILED_PICKUP = "failed_pickup",
    KEYFRAME = "keyframe",
    MOVE = "move",
    PICKUP_CARD = "pickup_card",
    PICKUP_LOCATION = "pickup_location",
    PLAYER_JOIN = "player_join",
    RETURNED_CARD = "returned_card"
  ]

  belongs_to :game
  belongs_to :card, optional: true

  validates :game_id, :user, :event_type, presence: true
  validates :event_type, inclusion: { in: EVENT_TYPES }
end
