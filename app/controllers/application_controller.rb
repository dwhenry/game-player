class ApplicationController < ActionController::Base
  helper_method :current_user
  def current_user
    cookies[:username] ||= "Tester: #{SecureRandom.uuid.split('-').first}"
  end
end
