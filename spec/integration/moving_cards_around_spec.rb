require 'rails_helper'

RSpec.describe 'moving cards around' do
  let(:config) { FactoryBot.create(:game_config, :single_task) }
  let(:game) do
    GameInitializer.new(config).call(players: 2).tap do |game|
      game.join("Jim")
      game.join("Bob")

      game.play
    end
  end
  let(:card) { game.card_objects.order(:last_move_id).first }
  let(:top_card) { game.card_objects.order(:last_move_id).last }
  let(:player1_id) { game.players.keys[0] }
  let(:player2_id) { game.players.keys[1] }

  before do
    cookies["game_player_id_#{game.id}"] = player1_id
  end

  context 'when I do not own the card' do
    before do
      card.update(owner_id: player2_id)
    end

    it 'I can not move the card' do
      post "/games/#{game.id}/cards/card:::#{card.id}/move", params: { location_id: player1_id, stack: 'hand' }

      expect(card.reload).to have_attributes(location_id: 'tasks', stack: 'pile')
    end

    it 'I get an appropriate error message' do
      post "/games/#{game.id}/cards/card:::#{card.id}/move", params: { location_id: player1_id, stack: 'hand' }

      expect(parsed_response).to eq(success: false, message: "not your card to move", code: "NYC")
    end

    it 'Attempted movement gets added to the logs' do
      card_name = config.decks.dig('tasks', card.card_id, 'name')

      post "/games/#{game.id}/cards/card:::#{card.id}/move", params: { location_id: player1_id, stack: 'hand' }

      expect(game.reload.events).to match_array([
        have_attributes(
          "user" => player1_id,
          "object_ref" => "card:::#{card.id}",
          "event_type" => Event::FAILED_MOVE,
          "data" => {
            "card_name" => card_name,
            "location_id" => player1_id,
            "stack" => "hand"
          }
        )
      ])
    end
  end

  context 'when I do own the card' do
    it 'I can drop it on a new stack'
    it 'I lose ownership of the card as I drop it'

  end
end
