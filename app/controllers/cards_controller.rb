class CardsController < ApplicationController
  def take
    ownership = CardOwnership.new(game: game, user: current_user)

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
end
