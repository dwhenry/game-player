require 'rails_helper'

RSpec.describe 'Playing the game', type: :request do
  let(:config) { FactoryBot.create(:game_config, :single_task) }
  let(:card_id) { config.decks["tasks"].keys.first }
  let(:player_id) { SecureRandom.uuid }

  before do
    cookies[:username] = player_id
  end

  context 'initialising a game from a config' do
    let(:game) { Game.last }
    before do
      get "/games/new", params: { game_config_id: config.id, players: 3 }
    end

    it 'creates a game with specific number of player slots' do
      expect(game.players.size).to eq(3)
      expect(game.players.values.uniq).to eq(["__FUCK YOU_PHILE__"])
    end

    it 'locks the config for editing' do
      expect(config.reload).to have_attributes(locked: true)
    end

    it 'assigns cards to default locations within the game object' do
      expect(game.cards).to match([
        hash_including(
          "card_id" => card_id,
          "location_id" => "tasks",
          "stack" => "pile",
          "stage" => 0
        ),
        hash_including(
          "card_id" => card_id,
          "location_id" => "tasks",
          "stack" => "pile",
          "stage" => 0
        )
      ])
    end

    it 'has a state of waiting-for-players' do
      expect(game).to have_attributes(state: 'waiting-for-players')
    end

    xit 'will not allow games moves to be made'
  end

  context 'waiting for players to join' do
    let(:game) { GameInitializer.new(config).call(players: 2) }

    it 'allows a player to join' do
      post "/games/#{game.id}/join"

      expect(game.reload.players.values).to eq([player_id, Game::PENDING_PLAYER])
    end

    it 'does not allow a player to join twice' do
      post "/games/#{game.id}/join"
      post "/games/#{game.id}/join"

      expect(game.reload.players.values).to eq([player_id, Game::PENDING_PLAYER])
    end
  end

  context 'once all player slots have been taken' do
    let(:game) { GameInitializer.new(config).call(players: 2) }
    let(:other_player) { SecureRandom.uuid }

    before do
      game.join(other_player)
      post "/games/#{game.id}/join"
    end

    it 'has a state of ready-to-play' do
      expect(game.reload).to have_attributes(state: 'ready-to-play')
    end

    xit 'will not allow games moves to be taken'

    it 'no more players can join' do
      cookies[:user_id] = SecureRandom.uuid

      post "/games/#{game.id}/join"

      expect(response).to redirect_to(root_path)
    end

    context 'starting the game' do
      let(:cards) { game.card_objects }
      before do
        post "/games/#{game.id}/start"
      end

      it 'will populate the cards table from the game object representation' do
        expect(cards.map(&:attributes)).to match([
          hash_including(
            "game_id" => game.id,
            "card_id" => card_id,
            "location_id" => "tasks",
            "stack" => "pile",
            "stage" => 0,
            "last_move_id" => 0
          ),
          hash_including(
            "game_id" => game.id,
            "card_id" => card_id,
            "location_id" => "tasks",
            "stack" => "pile",
            "stage" => 0,
            "last_move_id" => 1
          )
        ])
      end

      it 'will move the game state to playing' do
        expect(game.reload).to have_attributes(state: 'playing')
      end

      xit 'will allow games moves to be taken'
      xit 'gives a sensibkle response if two people try and start the game'

      it 'can not be started a second time' do
        travel_to(5.minutes.from_now) do
          expect { post "/games/#{game.id}/start" }.not_to change { cards.reload.pluck(:updated_at) }
        end
      end
    end
  end

  it 'will fail to start the game if all player spots have not been filled' do
    game = GameInitializer.new(config).call(players: 2)
    post "/games/#{game.id}/start"

    expect(game.reload).to have_attributes(state: 'waiting-for-players')

    # do we need an error here??? maybe if we have a json response
  end

  context 'when the game state is playing' do
    let(:game) do
      GameInitializer.new(config).call(players: 2).tap do |game|
        game.join(SecureRandom.uuid)
        game.join(player_id)

        game.play
      end
    end

    it 'will allow games moves to be taken'

    context 'when no movements have been detected in the last X hours' do
      let(:pre_archive_action) {}

      around do |spec|
        game
        pre_archive_action
        travel_to(5.hours.from_now) do
          GameArchiver.call
          spec.run
        end
      end

      it 'will move the game state to archived' do
        expect(game.reload).to have_attributes(state: 'archived')
      end

      xit 'will not allow games moves to be taken'

      context 'when the card state has changed' do
        let(:pre_archive_action) do
          card = game.card_objects.last
          card.update!(
            location_id: player_id,
            stack: 'hand',
            last_move_id: game.card_objects.maximum(:last_move_id) + 1
          )
        end

        it 'will store the cards state back onto the game' do
          expect(game.reload.cards).to match([
            hash_including(
              "card_id" => card_id,
              "location_id" => "tasks",
              "stack" => "pile",
              "stage" => 0
            ),
            hash_including(
              "card_id" => card_id,
              "location_id" => player_id,
              "stack" => "hand",
              "stage" => 0
            )
          ])
        end
      end

      it 'will delete the card objects to free up DB rows' do
        expect(game.card_objects.reload).to be_empty
      end
    end
  end

  context 'when the game state is archived' do
    let(:game) do
      GameInitializer.new(config).call(players: 2).tap do |game|
        game.join(SecureRandom.uuid)
        game.join(player_id)

        game.play
        game.archive
      end
    end

    xit 'will not allow games moves to be taken'

    context 'restarting the game' do
      let(:cards) { game.card_objects }

      before do
        post "/games/#{game.id}/start"
      end

      it 'will populate the cards table from the game object representation' do
        expect(cards.reload.map(&:attributes)).to match([
          hash_including(
            "game_id" => game.id,
            "card_id" => card_id,
            "location_id" => "tasks",
            "stack" => "pile",
            "stage" => 0,
            "last_move_id" => 0
          ),
          hash_including(
            "game_id" => game.id,
            "card_id" => card_id,
            "location_id" => "tasks",
            "stack" => "pile",
            "stage" => 0,
            "last_move_id" => 1
          )
        ])
      end

      it 'will move the game state to playing' do
        expect(game.reload).to have_attributes(state: 'playing')
      end

      xit 'will allow games moves to be taken'
    end
  end
end
