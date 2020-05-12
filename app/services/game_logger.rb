class GameLogger
  attr_reader :game, :user, :card_name

  def initialize(game:, user:, card_name:)
    @game = game
    @user = user
    @card_name = card_name
  end

  def failed_move_to(location_id:, stack:)
    # "#{user} failed to move #{card_name} to #{destination}, he didn't own the card"
    update_logs(
      type: "failed_move",
      destination: "#{location_name(location_id)}(#{stack})"
    )
  end

  def pickup_card(location_id:, stack:)
    # "#{user} picked up #{card_name} from #{destination}"
    update_logs(
      type: "card_pickup",
      source: "#{location_name(location_id)}(#{stack})"
    )
  end

  def pickup_location(location_id:, stack:)
    # "#{user} picked up a card from #{source}"
    update_logs(
      type: "location_pickup",
      source: "#{location_name(location_id)}(#{stack})"
    )
  end

  def return_card(location_id:, stack:)
    # "#{user} returned #{card_name} to #{source}"
    update_logs(
      type: "returned_card",
      source: "#{location_name(location_id)}(#{stack})"
    )
  end

  def failed_pickup(location_id:, stack:)
    # "#{user} failed to pickup #{card_name} from #{source}"
    update_logs(
      type: "failed_pickup",
      source: "#{location_name(location_id)}(#{stack})"
    )
  end

  def location_name(location_id)
    return location_id if %w[tasks achievements employees].include?(location_id)

    game.players[location_id]
  end

  def log_message(details)
    {
      user_id: user,
      timestamp: Time.now.to_i,
      card_name: card_name,
      details: details
    }
  end

  def update_logs(details)
    log = game.user_logs.find_or_initialize_by(user: user)
    log.logs ||= []
    log.logs.push(log_message(details))
    log.logs = log.logs[-100..-1] if log.logs.length > 120
    log.save
  end
end
