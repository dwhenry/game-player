require 'rails_helper'

RSpec.describe 'Playing the game', type: :request do
  let(:config) { FactoryBot.create(:game_config, :single_task) }
  let(:game) do
    GameInitializer.new(config).call(players: 2).tap do |game|
      game.join(player1_id)
      game.join(player2_id)

      game.play
    end
  end
  let(:card) { game.card_objects.first }
  let(:other_card) { game.card_objects.last }
  let(:player1_id) { SecureRandom.uuid }
  let(:player2_id) { SecureRandom.uuid }

  before do
    cookies[:username] = player1_id
  end

  context 'requestion ownership by card ID' do
    it 'makes me the card owner' do
      post "/games/#{game.id}/cards/card:#{card.identity}/take"

      expect(parsed_response).to eq(success: true)
      expect(card.reload).to have_attributes(owner_id: player1_id)
    end

    context 'if someone else already owns this card' do
      before do
        card.update!(owner_id: player2_id)
      end

      it 'returns an unsuccessful status' do
        post "/games/#{game.id}/cards/card:#{card.identity}/take"

        expect(parsed_response).to eq(success: false)
      end

      it 'does not make me the owner of the card - still owned by the other player' do
        post "/games/#{game.id}/cards/card:#{card.identity}/take"

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
        post "/games/#{game.id}/cards/card:#{card.identity}/take"

        expect(parsed_response).to eq(success: false)
      end

      it 'does not make me the owner of the card - still pending ownership' do
        post "/games/#{game.id}/cards/card:#{card.identity}/take"

        expect(card.reload).to have_attributes(owner_id: nil)
      end
    end

    context 'if I already own a different card' do
      before do
        other_card.update!(owner_id: player1_id)
      end

      it 'release any other cards I own' do
        post "/games/#{game.id}/cards/card:#{card.identity}/take"

        expect(parsed_response).to eq(success: true)
        expect(other_card.reload).to have_attributes(owner_id: nil)
      end
      it 'makes me the card owner' do
        post "/games/#{game.id}/cards/card:#{card.identity}/take"

        expect(parsed_response).to eq(success: true)
        expect(card.reload).to have_attributes(owner_id: player1_id)
      end
    end
  end

  xit 'can request ownership of a card by location' do
    post "/games/#{game.id}/ownership/location:tasks:pile:ABCD"

    list = Ownership.new(game.id).list
    owner_id = list["#{game.id}:location:tasks:pile-9"]
    expect(Ownership.new(game.id).list).to eq("#{game.id}:location:tasks:pile" => [owner_id])

    expect(parsed_response).to eq(success: true)
  end

  context 'If someone else owns the card' do
    it 'rejects ownership requests'
    # it 'rejects movement requests'
  end

  context 'if I own the card' do
    it 'I can request it again by card ID'
    # need a way to determine if
    it 'will log events for processing'
  end

  context 'if no one owns the card' do
    it 'I failed ownership and this was lagged so ignore it..'
  end

end
