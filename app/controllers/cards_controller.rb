class CardsController < ApplicationController
  before_action :validate_game_state
  before_action :validate_player

  def take
    ownership = CardOwnership.new(game: game, user: current_player)

    if ownership.take(params[:id])
      render json: { success: true }
    else
      render json: { success: false }
    end
  end

  private

  def game
    @game ||= Game.find(params[:game_id])
  end

  def validate_game_state
    if game.state != 'playing'
      render json: { status: false, error: "Please restart game to make a mode", code: "GRR" }
    end
  end

  def validate_player
    unless game.players.keys.include?(current_player)
      render json: { status: false, error: "NOT A PLAYER", code: "NAP" }
    end
  end

  def current_player
    cookies["game_player_id_#{game.id}"]
  end
end
