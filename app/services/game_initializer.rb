class GameInitializer
  class InvalidNumberOfPlayers < StandardError; end
  PLAYERS = (2..6)
  attr_reader :config

  def initialize(config)
    @config = config
  end

  def call(players: 6)
    raise InvalidNumberOfPlayers unless PLAYERS.cover?(players)
    params = {}
    players_config = players.times.each_with_object({}) do |_, hash|
      uuid = SecureRandom.uuid
      hash[uuid] = Game::PENDING_PLAYER
      params[uuid] = { cash: 10, energy: 0, sp: 0 }
    end

    Game.create!(
      game_config: config,
      cards: locations,
      players: players_config,
      params: params,
      name: "#{config.name}: #{Date.today}",
      state: 'waiting-for-players',
      sprint: 0,
    )
  end

  private

  def locations
    %w[tasks achievements employees].flat_map do |type|
      shuffled_deck(type, location_id: type, stack: 'pile')
    end
  end

  def shuffled_deck(type, args)
    cards = config.decks[type].flat_map do |id, card|
      Array.new(card['number'].to_i) { id }
    end
    cards.shuffle.map { |card_id| args.merge(id: SecureRandom.uuid, card_id: card_id, stage: 0) }
  end
end
