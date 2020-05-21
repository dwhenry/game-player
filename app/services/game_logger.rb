class GameLogger
  KEYFRAME_FREQUENCY = 20
  KEYFRAME_MEMORY = 5 # this means we keep the last 95 events in the DB

  attr_reader :game, :user, :card_name, :object_ref

  def initialize(game:, user:, card_name:, object_ref:)
    @game = game
    @user = user
    @card_name = card_name
    @object_ref = object_ref
  end

  def failed_move_to(location_id:, stack:)
    # "#{user} failed to move #{card_name} to #{destination}, he didn't own the card"
    create_event(
      Event::FAILED_MOVE,
      location_id: location_id,
      stack: stack
    )
  end

  def pickup_card(location_id:, stack:)
    # "#{user} picked up #{card_name} from #{destination}"
    create_event(
      Event::PICKUP_CARD,
      location_id: location_id,
      stack: stack
    )
  end

  def pickup_location(location_id:, stack:)
    # "#{user} picked up a card from #{source}"
    create_event(
      Event::PICKUP_LOCATION,
      location_id: location_id,
      stack: stack
    )
  end

  def move(location_id:, stack:, card_id:)
    create_event(
      Event::MOVE,
      card_id: card_id,
      location_id: location_id,
      stack: stack
    )

  end

  def return_card(location_id:, stack:)
    # "#{user} returned #{card_name} to #{source}"
    create_event(
      Event::RETURNED_CARD,
      location_id: location_id,
      stack: stack
    )
  end

  def failed_pickup(location_id:, stack:)
    # "#{user} failed to pickup #{card_name} from #{source}"
    create_event(
      Event::FAILED_PICKUP,
      location_id: location_id,
      stack: stack
    )
  end

  def log_message(details)
    {
      user_id: user,
      timestamp: Time.now.to_i,
      card_name: card_name,
      details: details
    }
  end

  def create_event(type, data)
    event = game.events.create!(
      user: user,
      object_ref: object_ref,
      event_type: type,
      data: data.merge(card_name: card_name)
    )
    event.reload
    if (event.order % KEYFRAME_FREQUENCY).zero?
      game.events.create!(
        user: Event::KEYFRAME,
        object_ref: Event::KEYFRAME,
        event_type: Event::KEYFRAME,
        data: game.keyframe
      )
      game.events.order(:order).offset(KEYFRAME_FREQUENCY * KEYFRAME_MEMORY).delete_all
    end
  end
end
