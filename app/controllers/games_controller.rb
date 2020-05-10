class GamesController < ApplicationController
  def new
    config = GameConfig.find(params[:game_config_id])

    config.update(locked: true)
    game = GameInitializer.new(config).call(players: params.fetch(:players).to_i)

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
      action = case params[:task]
               when 'cardMove'
                 CardMover.new(game, params[:card], params[:action_id])
               when 'incRound'
                 IncrementRound.new(game, params[:player][:id], params[:action_id])
               when 'changeTokens'
                 ChangeToken.new(game, params[:token], params[:action_id])
               else
                 render json: { error: "Unknown action: #{params[:taskl]}", next_action: game.next_action }, status: 500
                 return
               end
      action.call
      if action.error.present?
        render json: { error: action.error, next_action: game.next_action }, status: 500
      else
        render json: GameRender.new(game, current_user).call
      end
    else
      redirect_to root_path
    end
  end

  def join
    game = Game.find_by(id: params[:id])
    if (game_player_id = game&.join(current_user))
      cookies["game_player_id_#{game.id}"] = game_player_id
      redirect_to game_path(game)
    else
      redirect_to root_path
    end
  end

  def start
    game = Game.find_by(id: params[:id])
    if game.ready? && game.play
      redirect_to game_path(game)
    else
      redirect_to root_path
    end
  end
end
