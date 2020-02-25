class ApplicationController < ActionController::Base
  helper_method :current_user
  def current_user
    cookies[:user_name] ||= "Tester: #{SecureRandom.uuid.split('-').first}"
  end
end
