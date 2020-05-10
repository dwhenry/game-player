require 'rails_helper'

RSpec.describe 'Playing the game', type: :request do
  let(:config) { FactoryBot.create(:game_config, :single_task) }
  let(:game) { GameInitializer.new(config).call }
  let(:card) { game.cards.first }
  let(:fred_id) { game.players.keys[0] }

  it 'can request ownership of a card by ID' do
    cookies[:username] = fred_id

    post "/games/#{game.id}/ownership/card:#{card['id']}"
    expect(Ownership.new(game.id).list).to eq("#{game.id}:card:#{card['id']}:" => fred_id)

    expect(parsed_response).to eq(success: true)
  end

  it 'can request ownership of a card by location' do
    cookies[:username] = fred_id

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
