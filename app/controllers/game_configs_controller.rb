class GameConfigsController < ApplicationController
  def new
    if params[:parent_id]
      parent = GameConfig.find(params[:parent_id])
      attrs = parent.attributes.except(:id, :created_at, :updated_at)
      game_config = GameConfig.create!(attrs.merge(parent_id: parent.id))
    else
      game_config = GameConfig.create!(decks: { tasks: {}, achievements: {}, employees: {} })
    end

    redirect_to edit_game_config_path(game_config)
  end

  def edit
    @game_config = GameConfig.find(params[:id])
    @card = {}
  end

  def update
    @game_config = GameConfig.find(params[:id])
    @card = params[:card].permit(:id, :name, :cost, :actions, :deck, :number).to_h

    if @game_config.update_card(@card)
      redirect_to edit_game_config_path(@game_config.id)
    else
      render :edit
    end
  end
end
