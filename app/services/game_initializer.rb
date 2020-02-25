class GameInitializer
  attr_reader :config

  def initialize(config)
    @config = config
  end

  def call
    Game.create!(
      config: config,
      cards: locations + players,
      sprint: 0,
      next_action: SecureRandom.uuid
    )
  end

  private

  def locations
    %w{tasks achievements employees}.map do |type|
      {
        id: type,
        type: 'deck',
        pile: shuffled_deck(type),
        discard: [],
        fu: []
      }
    end
  end

  def players
    6.times.map do |i|
      {
        active: false,
        id: "Player #{i}",
        type: 'player',
        backlog: [],
        hand: [],
        fu: [],
        board: []
      }
    end
  end

  def shuffled_deck(type)
    config.decks[type].flat_map { |card| card['number'].to_i * card['id'] }.shuffle
  end
end
