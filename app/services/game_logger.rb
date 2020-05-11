class GameLogger
  attr_reader :game, :user, :card_name

  def initialize(game:, user:, card_name:)
    @game = game
    @user = user
    @card_name = card_name
  end

  def failed_move_to(location_id:, stack:)
    update_logs(
      user_id: user,
      timestamp: Time.now.to_i,
      message: "failed to move #{card_name} to #{location_name(location_id)}(#{stack}), he didn't own the card"
    )
  end

  def location_name(location_id)
    return location_id if %w[tasks achievements employees].include?(location_id)

    game.players[location_id]
  end

  def update_logs(message)
    log = game.user_logs.find_or_initialize_by(user: user)
    log.logs ||= []
    log.logs.push(message)
    log.logs = log.logs[-100..-1] if log.logs.length > 120
    log.save
  end
end
