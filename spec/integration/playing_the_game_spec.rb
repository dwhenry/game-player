require 'rails_helper'

RSpec.describe 'Playing the game', type: :request do
  let(:game) { Game.create } 
  let(:card) { game.cards.first }

  it 'can request ownership of a card by ID' do
    post "/games/#{game.id}/ownership/#{card.objectId}", {}, {username: 'fred'}
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