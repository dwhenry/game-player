require 'rails_helper'

RSpec.describe 'Playing the game', type: :request do
  let(:config) { FactoryBot.create(:game_config, :single_task) }
  let(:game) do
    GameInitializer.new(config).call(players: 2).tap do |game|
      game.join(SecureRandom.uuid)
      game.join(SecureRandom.uuid)

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

  context 'requestion ownership by card ID' do
    it 'makes me the card owner' do
      post "/games/#{game.id}/cards/card:#{card.id}/take"

      expect(parsed_response).to eq(success: true)
      expect(card.reload).to have_attributes(owner_id: player1_id)
    end

    context 'if someone else already owns this card' do
      before do
        card.update!(owner_id: player2_id)
      end

      it 'returns an unsuccessful status' do
        post "/games/#{game.id}/cards/card:#{card.id}/take"

        expect(parsed_response).to eq(success: false)
      end

      it 'does not make me the owner of the card - still owned by the other player' do
        post "/games/#{game.id}/cards/card:#{card.id}/take"

        expect(card.reload).to have_attributes(owner_id: player2_id)
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
        post "/games/#{game.id}/cards/card:#{card.id}/take"

        expect(parsed_response).to eq(success: false)
      end

      it 'does not make me the owner of the card - still pending ownership' do
        post "/games/#{game.id}/cards/card:#{card.id}/take"

        expect(card.reload).to have_attributes(owner_id: nil)
      end
    end

    context 'if I already own a different card' do
      before do
        top_card.update!(owner_id: player1_id)
      end

      it 'release any other cards I own' do
        post "/games/#{game.id}/cards/card:#{card.id}/take"

        expect(parsed_response).to eq(success: true)
        expect(top_card.reload).to have_attributes(owner_id: nil)
      end
      it 'makes me the card owner' do
        post "/games/#{game.id}/cards/card:#{card.id}/take"

        expect(parsed_response).to eq(success: true)
        expect(card.reload).to have_attributes(owner_id: player1_id)
      end
    end
  end

  context 'requesting ownership of a card by location' do
    it 'takes the card with the oldest last_move_id' do
      post "/games/#{game.id}/cards/location:tasks:pile:ABCD/take"

      expect(parsed_response).to eq(success: true)
      expect(top_card.reload).to have_attributes(owner_id: player1_id)
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
        card.update(owner_id: player2_id)
      end

      it 'fails to take a card from the stack' do
        post "/games/#{game.id}/cards/location:tasks:pile:ABCD/take"

        expect(parsed_response).to eq(success: false)
        expect(card.reload).to have_attributes(owner_id: player2_id)
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
