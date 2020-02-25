class GameRender
  attr_reader :game, :current_user

  def initialize(game, current_user)
    @game = game
    @current_user = current_user
  end

  def call
    {
      id: game.id,
      name: "Test #{game.id.split('-').first}",
      game_config_id: game.game_config_id,
      locations: locations,
      players: players,
      log: ['......', '.......']
    }

  end

  def locations
    stacks = game.cards.select { |stack| stack['type'] == 'deck' }
    stacks.each do |stack|
      deck = stack['id']

      {
        id: "deck-#{deck}",
        name: deck.titleize,
        deck: deck.singularize,
        items: {
          pile: { id: "deck-#{deck}-pile", cards: [render_card_back(stack['pile'].last)], count: stack['pile'].count },
          discard: { id: "deck-#{deck}-discard", cards: [render_card(stack['discard'].last)], count: stack['discard'].count },
          fu_cards: { id: "deck-#{deck}-fu", cards: stack['fu'].map { |card| render_card(card) }  },
        },
      }
    end
  end

  def players
    stacks = game.cards.select { |stack| stack['type'] == 'player' }

    stacks.map do |stack|
      next unless stack['active']

      player = stack['id']

      {
        id: player,
        name: player.titleize,
        backlog: [render_card_back(stack['backlog'].last)],
        hand: stack['hand'].map { |card| (player == current_user) ? render_card(card) : render_card_back(card) },
        fu_cards: stack['fu'].map { |card| render_card(card) },
        board: stack['board'].map { |card| render_card(card) },
      }
    end.compact
  end

  def render_card(card)
    lookup_card(card).merge(visible: true)
  end

  def render_card_back(card)
    details = lookup_card(card)
    {
      id: SecureRandom.uuid,
      deck: details['deck'],
      visible: false
    }
  end

  def lookup_card(card)
    @cards ||= game.game_config.decks.values.inject(&:merge)

    if card.is_a?(Hash)
      @cards[card['id']].merge(card)
    else
      @cards[card]
    end
  end
end
