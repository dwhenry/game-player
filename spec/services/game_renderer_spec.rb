require 'rails_helper'

RSpec.describe GameRender do
  let(:config) { FactoryBot.create(:game_config, :single_task) }
  let(:game) do
    GameInitializer.new(config).call(players: 2).tap do |game|
      game.join("Jim")
    end
  end
  let(:player_1_id) { game.players.keys.first }
  let(:player_2_id) { game.players.keys.last }

  let(:player_1_view) { described_class.new(game, player_1_id).call }
  let(:player_2_view) { described_class.new(game, player_2_id).call }

  context "when the game is waiting for players" do
    it "renders the games fields" do
      expect(player_1_view).to match(
        hash_including(
          id: game.id,
          name: game.name,
          state: "waiting-for-players",
          game_config_id: config.id,
          cards: an_instance_of(Array),
          locations: an_instance_of(Array),
          stacks: {
            deck: [['Backlog', 'pile'], ['Discard', 'discard'], ['Face up', 'fu_cards']],
            player: [['Backlog', 'pile'], ['Board', 'board'], ['Face up', 'fu_cards'], ['Staff', 'employees'], ['Hand', 'hand']],
          },
          params: {
            player_1_id => { 'cash' => 10, 'energy' => 0, 'sp' => 0 },
            player_2_id => { 'cash' => 10, 'energy' => 0, 'sp' => 0 }
          }
        )
      )
    end

    it "renders the locations" do
      expect(player_1_view[:locations]).to eq([
        { id: 'tasks',        name: 'Tasks',        type: 'deck' },
        { id: 'achievements', name: 'Achievements', type: 'deck' },
        { id: 'employees',    name: 'Employees',    type: 'deck' },
        { id: player_1_id,    name: 'Jim',          type: 'player' },
        { id: player_2_id,    name: 'Pending',      type: 'player' }
      ])
    end

    it "render the cards" do
      expect(player_1_view[:cards]).to match([
        {
          id: an_instance_of(String),
          deck: 'tasks',
          visible: 'back',
          stackId: 'tasks-pile',
          objectId: 'location:tasks:pile',
        },
        {
          id: an_instance_of(String),
          deck: 'tasks',
          visible: 'back',
          stackId: 'tasks-pile',
          objectId: 'location:tasks:pile',
        }
      ])
    end
  end

  context "when game has started" do
    before do
      game.join("Bob")
      game.play
    end

    it "renders the games fields" do
      expect(player_1_view).to match(
        hash_including(
          id: game.id,
          name: game.name,
          state: 'playing',
          game_config_id: config.id,
          cards: an_instance_of(Array),
          locations: an_instance_of(Array),
          stacks: {
            deck: [['Backlog', 'pile'], ['Discard', 'discard'], ['Face up', 'fu_cards']],
            player: [['Backlog', 'pile'], ['Board', 'board'], ['Face up', 'fu_cards'], ['Staff', 'employees'], ['Hand', 'hand']],
          },
          params: {
            player_1_id => { 'cash' => 10, 'energy' => 0, 'sp' => 0 },
            player_2_id => { 'cash' => 10, 'energy' => 0, 'sp' => 0 },
            'tasks' => { 'fu_cards' => { 'min_cards' => 2 } },
            'achievements' => { 'fu_cards' => { 'min_cards' => 2 } },
            'employees' => { 'fu_cards' => { 'min_cards' => 2 } },
          }
        )
      )
    end

    it "renders the locations" do
      expect(player_1_view[:locations]).to eq([
        { id: 'tasks',        name: 'Tasks',        type: 'deck' },
        { id: 'achievements', name: 'Achievements', type: 'deck' },
        { id: 'employees',    name: 'Employees',    type: 'deck' },
        { id: player_1_id,    name: 'Jim',          type: 'player' },
        { id: player_2_id,    name: 'Bob',          type: 'player' }
      ])
    end

    it "render the cards" do
      expect(player_1_view[:cards]).to match([
        {
          id: an_instance_of(String),
          deck: 'tasks',
          visible: 'back',
          stackId: 'tasks-pile',
          objectId: 'location:tasks:pile',
        },
        {
          id: an_instance_of(String),
            deck: 'tasks',
            visible: 'back',
            stackId: 'tasks-pile',
            objectId: 'location:tasks:pile',
        }
      ])
    end

    context "when cards are in a players hand" do
      let(:owner) { CardOwnership.build(game: game, user: player_1_id, object_ref: 'location:tasks:pile') }
      let!(:card) do
        owner.take
        owner.move(to_location_id: player_1_id, to_stack: 'hand')
      end

      it "they are visible to the player" do
        expect(player_1_view[:cards]).to match(
          array_including(
            {
              id: an_instance_of(String),
              deck: 'tasks',
              visible: 'back',
              stackId: 'tasks-pile',
              objectId: 'location:tasks:pile',
            },
            {
              id: card.id,
              name: "Pivot",
              cost: "5B",
              deck: "tasks",
              round: 0,
              rounds: "",
              actions: "+1 Employee",
              visible: "face",
              stackId: "#{player_1_id}-hand",
              objectId: "card:#{player_1_id}:hand:#{card.id}"
            }
          )
        )

      end

      it "they not are visible to opponents" do
        expect(player_2_view[:cards]).to match_array([
          {
            id: an_instance_of(String),
            deck: 'tasks',
            visible: 'back',
            stackId: 'tasks-pile',
            objectId: 'location:tasks:pile',
          },
          {
            id: card.id,
            deck: "tasks",
            visible: "back",
            stackId: "#{player_1_id}-hand",
            objectId: "card:#{player_1_id}:hand:#{card.id}"
          }
        ])
      end
    end
  end

  context "when game is archieved" do
    before do
      game.join("Bob")
      game.play
      game.archive
    end

    it "renders the games fields" do
      expect(player_1_view).to match(
        hash_including(
          id: game.id,
          name: game.name,
          state: 'archived',
          game_config_id: config.id,
          cards: an_instance_of(Array),
          locations: an_instance_of(Array),
          stacks: {
            deck: [['Backlog', 'pile'], ['Discard', 'discard'], ['Face up', 'fu_cards']],
            player: [['Backlog', 'pile'], ['Board', 'board'], ['Face up', 'fu_cards'], ['Staff', 'employees'], ['Hand', 'hand']],
          },
          params: {
            player_1_id => { 'cash' => 10, 'energy' => 0, 'sp' => 0 },
            player_2_id => { 'cash' => 10, 'energy' => 0, 'sp' => 0 },
            'tasks' => { 'fu_cards' => { 'min_cards' => 2 } },
            'achievements' => { 'fu_cards' => { 'min_cards' => 2 } },
            'employees' => { 'fu_cards' => { 'min_cards' => 2 } },
          }
        )
      )
    end

    it "renders the locations" do
      expect(player_1_view[:locations]).to eq([
        { id: 'tasks',        name: 'Tasks',        type: 'deck' },
        { id: 'achievements', name: 'Achievements', type: 'deck' },
        { id: 'employees',    name: 'Employees',    type: 'deck' },
        { id: player_1_id,    name: 'Jim',          type: 'player' },
        { id: player_2_id,    name: 'Bob',          type: 'player' }
      ])
    end

    it "render the cards" do
      expect(player_1_view[:cards]).to match([
        {
          id: an_instance_of(String),
          deck: 'tasks',
          visible: 'back',
          stackId: 'tasks-pile',
          objectId: 'location:tasks:pile',
        },
        {
          id: an_instance_of(String),
          deck: 'tasks',
          visible: 'back',
          stackId: 'tasks-pile',
          objectId: 'location:tasks:pile',
        }
      ])
    end

    context "when cards are in a players hand" do
      let(:owner) { CardOwnership.build(game: game, user: player_1_id, object_ref: 'location:tasks:pile') }
      let!(:card) do
        game.play
        owner.take
        card = owner.move(to_location_id: player_1_id, to_stack: 'hand')
        game.archive
        card
      end

      it "they are visible to the player" do
        expect(player_1_view[:cards]).to match(
          array_including(
            {
              id: an_instance_of(String),
              deck: 'tasks',
              visible: 'back',
              stackId: 'tasks-pile',
              objectId: 'location:tasks:pile',
            },
            {
              id: card.id,
              name: "Pivot",
              cost: "5B",
              deck: "tasks",
              round: 0,
              rounds: "",
              actions: "+1 Employee",
              visible: "face",
              stackId: "#{player_1_id}-hand",
              objectId: "card:#{player_1_id}:hand:#{card.id}"
            }
          )
        )

      end

      it "they not are visible to opponents" do
        expect(player_2_view[:cards]).to match_array([
          {
            id: an_instance_of(String),
            deck: 'tasks',
            visible: 'back',
            stackId: 'tasks-pile',
            objectId: 'location:tasks:pile',
          },
          {
            id: card.id,
            deck: "tasks",
            visible: "back",
            stackId: "#{player_1_id}-hand",
            objectId: "card:#{player_1_id}:hand:#{card.id}"
          }
        ])
      end
    end
  end
end
