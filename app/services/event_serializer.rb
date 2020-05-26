class EventSerializer
  attr_reader :game, :user

  def initialize(game:, user:)
    @game = game
    @user = user
  end

  def as_json(event)
    return move_json(event) if event.event_type == Event::MOVE
    default_json(event)
  end

  private

  def move_json(event)
    _, from_location_id, from_stack, _ = event.object_locator.split(':')
    {
      key: event.id,
      order: event.order,
      user: user,
      gameID: game.id,
      objectLocator: event.object_locator,
      eventType: event.event_type,
      from: { locationId: from_location_id, stack: from_stack },
      to: { locationId: event.data.fetch(:location_id), stack: event.data.fetch(:stack) },
      timestamp: event.created_at.to_i,
      card: card_renderer.render_card(event.card)
    }
  end

  def default_json(event)
    _, from_location_id, from_stack, _ = event.object_locator.split(':')
    {
      key: event.id,
      order: event.order,
      user: user,
      gameID: game.id,
      objectLocator: event.object_locator,
      eventType: event.event_type,
      timestamp: event.created_at.to_s(:short),
      from: { locationId: from_location_id, stack: from_stack },
      data: event.data
    }
  end

  def card_renderer
    @card_renderer ||= GameRender.new(game, user)
  end
end
