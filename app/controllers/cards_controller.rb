class CardsController < ApplicationController
  before_action :validate_game_state
  before_action :validate_player

  def take
    ownership = CardOwnership.build(game: game, user: current_player, object_id: params[:id])

    if ownership.take
      render json: { success: true }
    else
      render json: { success: false, message: ownership.error_message, code: ownership.error_code }
    end
  end

  def move
    ownership = CardOwnership.build(game: game, user: current_player, object_id: params[:id])

    if ownership.move(location_id: params[:location_id], stack: params[:stack])

    else
      render json: { success: false, message: ownership.error_message, code: ownership.error_code }
    end
  end

  private

  def game
    @game ||= Game.find(params[:game_id])
  end

  def validate_game_state
    if game.state != 'playing'
      render json: { status: false, error: "Please restart game to make a mode", code: ErrorCodes::GAME_RESTART_REQUIRED }
    end
  end

  def validate_player
    unless game.players.keys.include?(current_player)
      render json: { status: false, error: "NOT A PLAYER", code: ErrorCodes::NOT_A_PLAYER }
    end
  end

  def current_player
    cookies["game_player_id_#{game.id}"]
  end
end
