class GamesController < ApplicationController
  def new
    config = GameConfig.find(params[:game_config_id])

    config.update(locked: true)
    game = GameInitializer.new(config).call

    redirect_to game_path(game.id)
  end

  def show
    @game = Game.find_by(id: params[:id])
    if @game
      @game_board = GameRender.new(@game, current_user).call

      respond_to do |format|
        format.json do
          render json: @game_board
        end
        format.html {}
      end
    else
      redirect_to root_path
    end
  end

  def update
    game = Game.find_by(id: params[:id])
    if game
      flash[:error] = game.move_card(params[:card])
      redirect_to game_path(game)
    else
      redirect_to root_path
    end
  end

  def join
    game = Game.find_by(id: params[:id])
    if game
      game.join(current_user)
      redirect_to game_path(game)
    else
      redirect_to root_path
    end
  end
end
