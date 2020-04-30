require 'rails_helper'

RSpec.describe 'Playing the game', type: :request do
  let(:config) { FactoryBot.create(:game_config, :single_task) }
  let(:game) { GameInitializer.new(config).call }
  let(:card) { game.cards.first }
  let(:fred_id) { game.players.keys[0] }

  it 'can request ownership of a card by ID' do
    post "/games/#{game.id}/ownership/card:#{card['id']}:", params: {}
    expect(redis.get(:ownerships)).to eq({card.objectId => 'fred'})
  end

  it 'can request ownership of a card by location'

  context 'If someone else owns the card' do
    it 'rejects ownership requests'
    it 'rejects movement requests'
  end

  context 'if I own the card' do
    it 'will log events for processing'
  end

  context 'if no one owns the card' do
    it 'I failed ownership and this was lagged so ignore it..'
  end

end
