class GameConfigsController < ApplicationController
  def new
    if params[:parent_id]
      parent = GameConfig.find(params[:parent_id])
      attrs = parent.attributes.except(:id, :created_at, :updated_at)
      game_config = GameConfig.create!(attrs.merge(parent_id: parent.id))
    else
      game_config = GameConfig.create!(decks: { tasks: [], achievements: [], employees: [] })
    end

    redirect_to edit_game_config_path(game_config)
  end

  def edit
    @game_config = GameConfig.find(params[:id])
  end

  def update

  end
end
