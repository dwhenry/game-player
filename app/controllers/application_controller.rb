class ApplicationController < ActionController::Base
  def current_user
    cookies[:user_name] ||= "Tester: #{SecureRandom.uuid.split('-').first}"
  end
end
