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
    stacks.map do |stack|
      deck = stack['id']

      {
        id: "deck-#{deck}",
        name: deck.titleize,
        deck: deck.singularize,
        pile: { id: "deck-#{deck}-pile", cards: [render_card_back(stack['pile'].last)], count: stack['pile'].count },
        discard: { id: "deck-#{deck}-discard", cards: [render_card(stack['discard'].last)], count: stack['discard'].count },
        fu_cards: { id: "deck-#{deck}-fu", cards: render_cards(stack['fu'], min: 2) },
      }
    end
  end

  def players
    stacks = game.cards.select { |stack| stack['type'] == 'player' }

    stacks.map do |stack|
      player = stack['id']
      if stack['active']
        {
          status: 'active',
          id: player,
          name: player.titleize,
          backlog: [render_card_back(stack['backlog'].last)],
          hand: stack['hand'].map { |card| (player == current_user) ? render_card(card) : render_card_back(card) },
          fu_cards: stack['fu'].map { |card| render_card(card) },
          board: stack['board'].map { |card| render_card(card) },
        }
      elsif game.sprint.zero?
        {
          status: 'pending'
        }
      end
    end.compact
  end

  def render_cards(cards, min:)
    result = cards.map { |card| render_card(card) }
    (min - cards.length).times { result << empty_slot }
    result
  end

  def render_card(card)
    details = lookup_card(card)
    return empty_slot unless details
    details.merge(visible: 'face')
  end

  def render_card_back(card)
    details = lookup_card(card)
    return empty_slot unless details
    {
      id: SecureRandom.uuid,
      deck: details['deck'],
      visible: 'back'
    }
  end

  def empty_slot
    {
      id: SecureRandom.uuid,
      visible: 'slot'
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
