class CardsController < ApplicationController
  before_action :validate_game_state
  before_action :validate_player

  def take
    ownership = CardOwnership.build(game: game, user: game_player_id(game), object_locator: params[:id])

    if ownership.take
      render json: { success: true }
    else
      render json: { success: false, message: ownership.error_message, code: ownership.error_code }
    end
  end

  def move
    ownership = CardOwnership.build(game: game, user: game_player_id(game), object_locator: params[:id])

    if ownership.move(to_location_id: params[:location_id], to_stack: params[:stack])
      render json: { success: true }
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
    return if game.players[game_player_id(game)]

    render json: { status: false, error: "NOT A PLAYER", code: ErrorCodes::NOT_A_PLAYER }
  end
end
