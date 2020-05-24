class EventsController < ApplicationController
  def index
    game = Game.find(params[:game_id])
    player_id = game_player_id(game)

    if game.players.keys.include?(player_id)
      events = game.events.includes(:card).where('"order" > ?', params.fetch(:last_event_id, 0))
      serializer = EventSerializer.new(game: game, user: player_id)
      render json: {events: events.map { |e| serializer.as_json(e) } }
    else
      render json: { success: false, error: "Unknown player... goodbye.." }, code: 500
    end
  end
end
