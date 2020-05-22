class HomeController < ApplicationController
  def index
    @game_configs = GameConfig.order(updated_at: :desc).left_joins(:children)
    @game_configs = @game_configs.where(children_game_configs: { id: nil }) unless params[:show_all]
  end
end
