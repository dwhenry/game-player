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
    game.deck_stacks.map do |stack|
      deck = stack['id']

      {
        id: deck,
        name: deck.titleize,
        deck: deck.singularize,
        pile: { id: "deck-#{deck}-pile", cards: [render_card_back(last(stack['pile']))], count: stack['pile'].count },
        discard: { id: "deck-#{deck}-discard", cards: [render_card(last(stack['discard']))], count: stack['discard'].count },
        fu_cards: { id: "deck-#{deck}-fu", cards: render_cards(stack['fu'], min: 2) },
      }
    end
  end

  def players
    game.player_stacks(status: 'active').map do |stack|
      player = stack['id']

      {
        status: stack['status'],
        id: player,
        name: player.titleize,
        tokens: stack['tokens'],
        # cards
        employees: render_cards(stack['employees'], min: 1),
        backlog: [render_card_back(last(stack['backlog']))],
        hand: render_hand(stack, player),
        fu_cards: render_cards(stack['fu'], min: 1),
        board: render_cards(stack['board'], min: 1),
      }
    end
  end

  def render_hand(stack, player)
    return [empty_slot] if stack['hand'].empty?

    stack['hand'].map { |card| (player == current_user) ? render_card(card) : render_card_back(card) }
  end

  def render_cards(cards, min:)
    result = cards.map { |id, card_id| render_card([id, card_id]) }
    (min - cards.length).times { result << empty_slot }
    result
  end

  def render_card(ids)
    id, card_id = *ids
    card = lookup_card(card_id)
    return empty_slot unless card
    card.merge(id: id, visible: 'face')
  end

  def render_card_back(ids)
    id, card_id = *ids
    card = lookup_card(card_id)
    return empty_slot unless card
    {
      id: id,
      deck: card['deck'],
      visible: 'back'
    }
  end

  def empty_slot
    {
      id: SecureRandom.uuid,
      visible: 'slot'
    }
  end

  def last(stack)
    key = stack.keys.last

    [key, stack[key]]
  end

  def lookup_card(card_id)
    @cards ||= game.game_config.decks.values.inject(&:merge)
    @cards[card_id]
  end
end
