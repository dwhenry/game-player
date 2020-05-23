require 'rails_helper'

RSpec.feature 'Full stack tests', type: :feature, js: true do
  scenario 'I can start a game' do
    _given. i_have_set_my_name_to(me)
    _and.   i_create_a_game(players: 2)
    _then.  game_should_have_player(me)

    _when.  my_opponent_joins_the_game
    _then.  game_should_have_player(opponent)
    _and.   i_should_be_in_a_running_game
  end

  # scenario 'I can move a card around' do
  #   _given. a_game_exist(players: [me, opponent])
  #   _when.  i_move_card_to_my_hand
  #   _then.  i_should_have_the_card_in_my_hand
  # end
  #
  # scenario 'my oppenent can move a card around' do
  #   _given. a_game_exist(players: [me, opponent])
  #   _when.  my_opponent_moves_the_card_to_his_hand
  #   _then.  i_should_see_the_card_in_my_opponents_hand
  # end

  let(:me) { 'Jim' }
  let(:opponent) { 'Bob' }

  let!(:config) { FactoryBot.create(:game_config, :single_task) }
  let(:game) { Game.last }

  def i_have_set_my_name_to(name)
    visit root_path

    within(%{[data-selector="player"]}) do
      fill_in "Player name", with: name

      click_on "Update"
    end
  end

  def i_create_a_game(players:)
    visit root_path

    within(%{[data-selector="config-#{config.id}"]}) do
      select 2

      click_on "Start Game"
    end
  end

  def game_should_have_player(player_name)
    expect(game.reload.players.values).to include(player_name)
binding.pry
    expect(page).to have_css('.player__title', text: /#{player_name}/)
  end

  def my_opponent_joins_the_game
    game.join(opponent)
  end

  def i_should_be_in_a_running_game

  end

  def _given; Chain.new(self, __method__); end
  def _and; Chain.new(self, __method__); end
  def _when; Chain.new(self, __method__); end
  def _then; Chain.new(self, __method__); end

  class Chain
    def initialize(spec, action)
      @spec = spec
      @action = action
    end

    def method_missing(m, *a, &b)
      puts "#{@action.upcase[1..-1]} #{m.to_s.humanize}#{a.any? ? a.inspect : nil}"
      @spec.public_send(m, *a, &b)
      self
    end
  end
end
