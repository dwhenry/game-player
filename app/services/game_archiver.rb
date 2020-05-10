class GameArchiver
  NO_UPDATE_SINCE = 4.hours
  FUTURE = 1.minute

  def self.call
    Game
      .includes(:card_objects)
      .where(state: 'playing')
      .where.not(cards: { updated_at: NO_UPDATE_SINCE.ago..FUTURE.from_now})
      .each(&:archive)
  end
end
