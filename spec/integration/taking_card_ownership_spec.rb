require 'rails_helper'

RSpec.describe 'Playing the game', type: :request do
  let(:config) { FactoryBot.create(:game_config, :single_task) }
  let(:game) do
    GameInitializer.new(config).call(players: 3).tap do |game|
      game.join("Jim")
      game.join("Bob")
      game.join("Jones")

      game.play
    end
  end
  let(:card) { game.card_objects.order(:last_move_id).first }
  let(:top_card) { game.card_objects.order(:last_move_id).last }
  let(:player1_id) { game.players.keys[0] }
  let(:player2_id) { game.players.keys[1] }
  let(:player3_id) { game.players.keys[2] }

  before do
    cookies["game_player_id_#{game.id}"] = player1_id
  end

  # TODO: due to syncing issues it would be possible to grab the card from an old position
  # after another player had dropped it.... is this a concern?

  context 'request ownership by card ID' do
    it 'makes me the card owner' do
      post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

      expect(parsed_response).to eq(success: true)
      expect(card.reload).to have_attributes(owner_id: player1_id)
    end

    it 'logs the successfully picking up of the card' do
      card_name = config.decks.dig('tasks', card.card_id, 'name')

      post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

      expect(game.reload.events).to match(
        array_including(
          have_attributes(
            "user" => player1_id,
            "object_locator" => "card:tasks:pile:#{card.id}",
            "event_type" => Event::PICKUP_CARD,
            "data" => {
              "card_name" => card_name,
              "location_id" => "tasks",
              "stack" => "pile"
            }
          )
        )
      )
    end

    context 'if someone else already owns this card' do
      before do
        card.update!(owner_id: player2_id)
      end

      it 'returns an unsuccessful status' do
        post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

        expect(parsed_response).to eq(success: false, code: ErrorCodes::FAILED_TO_TAKE_CARD, message: "Failed to take ownership of card")
      end

      it 'does not make me the owner of the card - still owned by the other player' do
        post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

        expect(card.reload).to have_attributes(owner_id: player2_id)
      end

      it 'Logs the failure to pick up the card' do
        card_name = config.decks.dig('tasks', card.card_id, 'name')

        post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

        expect(game.reload.events).to match(
          array_including(
            have_attributes(
              "user" => player1_id,
              "object_locator" => "card:tasks:pile:#{card.id}",
              "event_type" => Event::FAILED_PICKUP,
              "data" => {
                "card_name" => card_name,
                "location_id" => "tasks",
                "stack" => "pile"
              }
            )
          )
        )
      end
    end

    context 'if someone else has already locked this card - in progress of taking ownership', avoid_transactions: true do
      class TestCard < ActiveRecord::Base
        establish_connection ActiveRecord::Base.configurations['test']
        self.table_name = 'cards'
      end

      around do |spec|
        begin
          c = TestCard.find(card.id)
          c.with_lock('FOR UPDATE NOWAIT') do
            spec.run
            c.save!
          end
        ensure
          TestCard.connection.disconnect!
        end
      end

      it 'returns an unsuccessful status' do
        post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

        expect(parsed_response).to eq(success: false, code: ErrorCodes::FAILED_TO_TAKE_CARD, message: "Failed to take ownership of card")
      end

      it 'does not make me the owner of the card - still pending ownership' do
        post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

        expect(card.reload).to have_attributes(owner_id: nil)
      end

      it 'Logs the failure to pick up the card' do
        card_name = config.decks.dig('tasks', card.card_id, 'name')

        post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

        expect(game.reload.events).to match(
          array_including(
            have_attributes(
              "user" => player1_id,
              "object_locator" => "card:tasks:pile:#{card.id}",
              "event_type" => Event::FAILED_PICKUP,
              "data" => {
                "card_name" => card_name,
                "location_id" => "tasks",
                "stack" => "pile"
              }
            )
          )
        )
      end
    end

    context 'if I already own a different card' do
      before do
        top_card.update!(owner_id: player1_id)
      end

      it 'release any other cards I own' do
        post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

        expect(parsed_response).to eq(success: true)
        expect(top_card.reload).to have_attributes(owner_id: nil)
      end

      it 'makes me the card owner' do
        post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

        expect(parsed_response).to eq(success: true)
        expect(card.reload).to have_attributes(owner_id: player1_id)
      end

      it 'Logs dropping the previous card and picking up the new one' do
        card_name = config.decks.dig('tasks', top_card.card_id, 'name')

        post "/games/#{game.id}/cards/card:tasks:pile:#{card.id}/take"

        expect(game.reload.events).to match(
          array_including(
            have_attributes(
              "user" => player1_id,
              "object_locator" => "card:tasks:pile:#{card.id}",
              "event_type" => Event::RETURNED_CARD,
              "data" => {
                "card_name" => card_name,
                "location_id" => "tasks",
                "stack" => "pile"
              }
            ),
            have_attributes(
              "user" => player1_id,
              "object_locator" => "card:tasks:pile:#{card.id}",
              "event_type" => Event::PICKUP_CARD,
              "data" => {
                "card_name" => card_name,
                "location_id" => "tasks",
                "stack" => "pile"
              }
            )
          )
        )
      end
    end

    context 'if I dont have the correct card location' do
      it 'fails to take ownership of the card' do
        post "/games/#{game.id}/cards/card:achievements:pile:#{card.id}/take"

        expect(parsed_response).to eq(code: "FTC", message: "Failed to take ownership of card", success: false)
        expect(card.reload).to have_attributes(owner_id: nil)
      end
    end
  end

  context 'requesting ownership of a card by location' do
    it 'takes the card with the oldest last_move_id' do
      post "/games/#{game.id}/cards/location:tasks:pile:ABCD/take"

      expect(parsed_response).to eq(success: true)
      expect(top_card.reload).to have_attributes(owner_id: player1_id)
    end

    it 'Logs the successful pickup of the card' do
      post "/games/#{game.id}/cards/location:tasks:pile:ABCD/take"

      expect(game.reload.events).to match(
        array_including(
          have_attributes(
            "user" => player1_id,
            "object_locator" => "location:tasks:pile:ABCD",
            "event_type" => Event::PICKUP_LOCATION,
            "data" => {
              "card_name" => "tasks (pile)",
              "location_id" => "tasks",
              "stack" => "pile"
            }
          )
        )
      )
    end


    context 'when someone already owns the top card' do
      before do
        top_card.update(owner_id: player2_id)
      end

      it 'takes the next oldest card in the stack' do
        post "/games/#{game.id}/cards/location:tasks:pile:ABCD/take"

        expect(parsed_response).to eq(success: true)
        expect(card.reload).to have_attributes(owner_id: player1_id)
        expect(top_card.reload).to have_attributes(owner_id: player2_id)
      end
    end

    context 'when all cards are taken' do
      before do
        top_card.update(owner_id: player2_id)
        card.update(owner_id: player3_id)
      end

      it 'fails to take a card from the stack' do
        post "/games/#{game.id}/cards/location:tasks:pile:ABCD/take"

        expect(parsed_response).to eq(success: false, code: ErrorCodes::FAILED_TO_TAKE_CARD, message: "Failed to take ownership of card")
        expect(card.reload).to have_attributes(owner_id: player3_id)
        expect(top_card.reload).to have_attributes(owner_id: player2_id)
      end
    end
  end

  context 'if I am not a player in the game' do
    before do
      cookies["game_player_id_#{game.id}"] = SecureRandom.uuid
    end

    it 'I can not take the card' do
      post "/games/#{game.id}/cards/card:#{card.id}/take"

      expect(card.reload).to have_attributes(owner_id: nil)
    end

    it 'I get an appropriate error and message' do
      post "/games/#{game.id}/cards/card:#{card.id}/take"

      expect(parsed_response).to eq(status: false, error: "NOT A PLAYER", code: "NAP")
    end
  end

  context 'if the game state is not in playing' do
    let(:card_id) { game.cards.first['id'] }
    before do
      game.archive
    end

    it 'I get an appropriate error and message' do
      post "/games/#{game.id}/cards/card:#{card_id}/take"

      expect(parsed_response).to eq(status: false, error: "Please restart game to make a mode", code: "GRR")
    end
  end
end
