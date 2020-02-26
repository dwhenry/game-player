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
      mover = CardMover.new(game, params[:card])
      mover.call
      if mover.error.present?
        flash[:error] = mover.error
        redirect_to game_path(game)
      else
        respond_to do |format|
          format.json do
            render json: GameRender.new(game, current_user).call
          end
          format.html {
            redirect_to game_path(game)
          }
        end
      end
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
