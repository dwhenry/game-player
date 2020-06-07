class EventsSerializer
  attr_reader :game, :user, :events

  def initialize(game:, user:, events:)
    @game = game
    @user = user
    @events = events
  end

  def as_json(*)
    events_json = events.map do |event|
      event.event_type == Event::MOVE ? move_json(event) : default_json(event)
    end
    { events: events_json }
  end

  private

  def move_json(event)
    _, from_location_id, from_stack, _ = event.object_locator.split(':')
    {
      key: event.id,
      order: event.order,
      user: user,
      username: game.players[user],
      gameID: game.id,
      objectLocator: event.object_locator,
      eventType: event.event_type,
      from: { locationId: from_location_id, stack: from_stack },
      to: { locationId: event.data.fetch(:location_id), stack: event.data.fetch(:stack) },
      timestamp: event.created_at.to_i,
      card: card_serializer.render_card(event.card)
    }
  end

  def default_json(event)
    _, from_location_id, from_stack, _ = event.object_locator.split(':')
    {
      key: event.id,
      order: event.order,
      user: event.user,
      username: game.players[event.user],
      gameID: game.id,
      objectLocator: event.object_locator,
      eventType: event.event_type,
      timestamp: event.created_at.to_s(:short),
      from: { locationId: from_location_id, stack: from_stack },
      data: event.data
    }
  end

  def card_serializer
    @card_serializer ||= GameSerializer.new(game, user)
  end
end
