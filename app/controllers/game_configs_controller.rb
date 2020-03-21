class GameConfigsController < ApplicationController
  def new
    if params[:parent_id]
      parent = GameConfig.find(params[:parent_id])
      attrs = parent.attributes.except(:id, :created_at, :updated_at)
      game_config = GameConfig.create!(attrs.except(*%w[id created_at updated_at locked]).merge(parent_id: parent.id))
    else
      game_config = GameConfig.create!(decks: { tasks: {}, achievements: {}, employees: {} })
    end

    redirect_to edit_game_config_path(game_config)
  end

  def show
    game_config = GameConfig.find(params[:id])
    render json: game_config
  end

  def edit
    @game_config = GameConfig.find(params[:id])
    @card = { id: '' }
  end

  def update_all
    @game_config = GameConfig.find(params[:id])
    decks = params[:decks]
    decks.each do |key, cards|
      decks[key] = cards.each_with_object({}) { |card, hash| hash[card['id']] = card }
    end
    if @game_config.update(decks: decks)
      render json: @game_config.as_json
    else
      render json: { error: "Update to update deck.. #{@game_config.errors.full_messages.join("\n")}" }, status: 500
    end
  end


  def update
    @game_config = GameConfig.find(params[:id])
    @card = params[:card].permit(:id, :name, :cost, :actions, :deck, :number, :rounds).to_h
    @card['id'] ||= '' # otherwise you can't modify anything...

    if @game_config.update_card(@card)
      respond_to do |format|
        format.json { render json: { card: @card } }
        format.html { redirect_to edit_game_config_path(@game_config.id) }
      end
    else
      render :edit
    end
  end
end
