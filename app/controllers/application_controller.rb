class ApplicationController < ActionController::Base
  helper_method :current_user, :player_name
  def current_user
    cookies[:username] ||= "Tester: #{SecureRandom.uuid.split('-').first}"
  end

  def player_name
    cookies[:playername] || current_user
  end

  def game_player_id(game)
    cookies["game_player_id_#{game.id}"]
  end
end
