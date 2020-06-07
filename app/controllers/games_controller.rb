class GamesController < ApplicationController
  def create
    config = GameConfig.find_by(id: params[:game_config_id])

    config.update!(locked: true)
    game = GameInitializer.new(config).call(players: params.fetch(:players).to_i)

    cookies["game_player_id_#{game.id}"] = game.join(player_name)

    redirect_to game_path(game.id)
  end

  def show
    @game = Game.find_by(id: params[:id])
    if @game
      @game_board = GameSerializer.new(@game, game_player_id(@game)).as_json
      @game_board['skipPolling'] = true if params[:skip_polling]

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
        render json: GameSerializer.new(game, current_user).call
      end
    else
      redirect_to root_path
    end
  end

  def join
    game = Game.find_by(id: params[:id])
    if (game_player_id = game&.join(player_name))
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
