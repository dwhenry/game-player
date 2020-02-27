class GameInitializer
  attr_reader :config

  def initialize(config)
    @config = config
  end

  def call
    Game.create!(
      game_config: config,
      cards: locations + players,
      sprint: 0,
      next_action: SecureRandom.uuid
    )
  end

  private

  def locations
    %w[tasks achievements employees].map do |type|
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
        status: 'pending',
        id: "Player #{i}",
        type: 'player',
        backlog: [],
        hand: [],
        fu: [],
        board: [],
        employees: [],
        tokens: { cash: 10, energy: 0, sp: 0 },
      }
    end
  end

  def shuffled_deck(type)
    cards = config.decks[type].flat_map do |id, card|
      Array.new(card['number'].to_i) { id }
    end
    cards.shuffle.map { |card_id| [SecureRandom.uuid, card_id, 0] }
  end
end
