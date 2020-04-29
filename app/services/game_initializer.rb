class GameInitializer
  attr_reader :config

  def initialize(config)
    @config = config
  end

  def call
    params = {}
    players = 6.times.each_with_object({}) do |_, hash|
      uuid = Securerandom.uuid
      hash[uuid] = Game::PENDING_PLAYER
      params[uuid] = { cash: 10, energy: 0, sp: 0 }
    end

    Game.create!(
      game_config: config,
      cards: { players: players, cards: locations, params: params},
      sprint: 0,
      next_action: SecureRandom.uuid
    )
  end

  private

  def locations
    %w[tasks achievements employees].map do |type|
      shuffled_deck(type, location_id: type, stack: 'pile')
    end
  end

  def shuffled_deck(type, args)
    cards = config.decks[type].flat_map do |id, card|
      Array.new(card['number'].to_i) { id }
    end
    cards.shuffle.map { |card_id| args.merge(id: SecureRandom.uuid, card: card_id, stage: 0) }
  end
end
