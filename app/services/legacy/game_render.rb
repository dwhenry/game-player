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
      log: ['......', '.......'],
      next_action: game.next_action
    }
    #
    # game.cards.flat_map do |stack|
    #
    #   cards = stack.slice('pile', 'discard', 'fu', 'employees', 'backlog', 'hand','board')
    #   cards.map do |id = nil, card_id = nil, round = nil|
    #     card = card_id && lookup_card(card_id)
    #     next unless card
    #
    #     if display_card
    #       card.merge(
    #         'id' => id,
    #         'visible' => 'face',
    #         round: round,
    #         type: stack[:type],
    #         owner: stack[:id]
    #       )
    #     else
    #       {
    #         id: id,
    #         deck: card['deck'],
    #         visible: 'back'
    #       }
    #     end
    #   end
    # end
    #
    # {
    #   id: game.id,
    #   name: "Test #{game.id.split('-').first}",
    #   game_config_id: game.game_config_id,
    #   next_action: game.next_action,
    #   cards: [],
    #   config: {
    #     deck: ['pile', 'discard', 'fu'],
    #     player: ['employees', 'backlog', 'hand', 'fu', 'board'],
    #   },
    #   owners: [
    #     {
    #       col_size: 4,
    #       list: [
    #         {
    #           id: 'task',
    #           name: 'tasks',
    #           type: 'deck'
    #         },
    #         {
    #           id: 'employee',
    #           name: 'employees',
    #           type: 'deck'
    #         },
    #         {
    #           id: 'achievement',
    #           name: 'achievements',
    #           type: 'deck'
    #         },
    #       ]
    #     },
    #     {
    #       col_size: 8,
    #       list: [
    #         {
    #           id: '<player_id>',
    #           name: '<player_id>',
    #           type: 'player'
    #         },
    #       ]
    #     },
    #   ]
    # }
  end

  def locations
    game.deck_stacks.map do |stack|
      deck = stack['id']

      {
        id: deck,
        name: deck.titleize,
        deck: deck.singularize,
        pile: { key: "deck-#{deck}-pile", cards: [render_card_back(*stack['pile'].last)], count: stack['pile'].count },
        discard: { key: "deck-#{deck}-discard", cards: [render_card(*stack['discard'].last)], count: stack['discard'].count },
        fu_cards: { key: "deck-#{deck}-fu", cards: render_cards(stack['fu'], min: 2) },
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
        backlog: [render_card_back(*stack['backlog'].last)],
        hand: render_hand(stack, player),
        fu_cards: render_cards(stack['fu'], min: 1),
        board: render_cards(stack['board'], min: 1),
      }
    end
  end

  def render_hand(stack, player)
    return [empty_slot] if stack['hand'].empty?

    stack['hand'].map { |card| (player == current_user) ? render_card(*card) : render_card_back(*card) }
  end

  def render_cards(cards, min:)
    result = cards.map { |args| render_card(*args) }
    (min - cards.length).times { result << empty_slot }
    result
  end

  def render_card(id = nil, card_id = nil, round = nil)
    card = card_id && lookup_card(card_id)
    return empty_slot unless card

    card.merge('id' => id, 'visible' => 'face', round: round)
  end

  def render_card_back(id = nil, card_id = nil, round = nil)
    card = card_id && lookup_card(card_id)
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

  def lookup_card(card_id)
    @cards ||= game.game_config.decks.values.inject(&:merge)
    @cards[card_id]
  end
end
