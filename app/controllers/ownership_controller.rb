class OwnershipController < ApplicationController
  def take
    game = Game.find(params[:game_id])
    if Ownership.new(game.id).take(params[:object_id], cookies[:user_id])
      render json: { success: true }
    else
      render json: { success: false }
    end
  end
end
