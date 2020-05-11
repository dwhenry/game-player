require 'rails_helper'

RSpec.describe GameInitializer do

  context 'a game with 2 instances of a single task card' do
    let(:config) { FactoryBot.create(:game_config, :single_task) }
    let(:task_card_id) { config.decks['tasks'].values.dig(0, 'id') }

    it 'correct initializes ' do
      game = described_class.new(config).call(players: 2)

      player1, player2 = game.players.keys

      expect(game).to have_attributes(
        cards: [
          hash_including(
            "card_id" => task_card_id,
            "location_id" => "tasks",
            "stack" => "pile",
            "stage" => 0
          ),
          hash_including(
            "card_id" => task_card_id,
            "location_id" => "tasks",
            "stack" => "pile",
            "stage" => 0
          )
        ],
        "params"=>{
          player1 => {
            "cash"=>10,
            "energy"=>0,
            "sp"=>0
          },
          player2 => {
            "cash"=>10,
            "energy"=>0,
            "sp"=>0
          },
        },
        players: {
          player1 => "__FUCK YOU_PHILE__",
          player2 => "__FUCK YOU_PHILE__",
        },
        game_config_id: config.id,
        sprint: 0,
        name: a_string_starting_with('Game: '),
        state: 'waiting-for-players',
      )
    end
  end
end
