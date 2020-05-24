class GameRender
  FACE_DOWN_STACK = %w[tasks-pile achievements-pile employees-pile].freeze
  attr_reader :game, :current_user

  def initialize(game, current_user)
    @game = game
    @current_user = current_user
  end

  def call
    {
      id: game.id,
      name: game.name,
      game_config_id: game.game_config_id,
      state: game.state,
      cards: cards,
      locations: locations,
      stacks: {
        deck: [['Backlog', 'pile'], ['Discard', 'discard'], ['Face up', 'fu_cards']],
        player: [['Backlog', 'pile'], ['Board', 'board'], ['Face up', 'fu_cards'], ['Staff', 'employees'], ['Hand', 'hand']],
      },
      params: game.params.merge(
        'tasks' => { 'fu_cards' => { 'min_cards' => 2 } },
        'achievements' => { 'fu_cards' => { 'min_cards' => 2 } },
        'employees' => { 'fu_cards' => { 'min_cards' => 2 } },
      )
    }
  end

  def locations
    [
      { id: 'tasks',        name: 'Tasks',        type: 'deck' },
      { id: 'achievements', name: 'Achievements', type: 'deck' },
      { id: 'employees',    name: 'Employees',    type: 'deck' }
    ] + game.players.map do |id, name|
      {
        id: id,
        name: name == Game::PENDING_PLAYER ? "Pending" : name,
        type: 'player'
      }
    end
  end

  def cards
    cards = game.state == 'playing' ? game.card_objects : game.cards
    cards.map do |card|
      render_card(card)
    end
  end

  def card_details
    @card_details ||= game.game_config.decks.values.inject(&:merge)
  end

  def render_card(card)
    stack_id = "#{card['location_id']}-#{card['stack']}"

    return face_down_card(card, stack_id, show_object_id: false) if FACE_DOWN_STACK.include?(stack_id)
    return face_down_card(card, stack_id) if card['stack'] == 'hand' && card['location_id'] != current_user
    face_up_card(card, stack_id)
  end

  def face_down_card(card, stack_id, show_object_id: true)
    card_detail = card_details.fetch(card['card_id'])
    {
      id: card['id'],
      deck: card_detail.fetch('deck'),
      visible: 'back',
      stackId: stack_id,
      objectId: object_ref(card, show_object_id: show_object_id)
    }
  end

  def face_up_card(card, stack_id)
    card_detail = card_details.fetch(card['card_id'])
    {
      id: card['id'],
      name: card_detail.fetch('name'),
      cost: card_detail.fetch('cost'),
      deck: card_detail.fetch('deck'),
      round: card['stage'],
      rounds: card_detail.fetch('rounds'),
      actions: card_detail.fetch('actions'),
      visible: 'face',
      stackId: stack_id,
      objectId: object_ref(card),
    }
  end

  def object_ref(card, show_object_id: true)
    return "card:#{card['location_id']}:#{card['stack']}:#{card['id']}" if show_object_id
    "location:#{card['location_id']}:#{card['stack']}:"
  end

    #
  # def players
  #   game.player_stacks(status: 'active').map do |stack|
  #     player = stack['id']
  #     {
  #       status: stack['status'],
  #       id: player,
  #       name: player.titleize,
  #       tokens: stack['tokens'],
  #       # cards
  #       employees: render_cards(stack['employees'], min: 1),
  #       backlog: [render_card_back(*stack['backlog'].last)],
  #       hand: render_hand(stack, player),
  #       fu_cards: render_cards(stack['fu'], min: 1),
  #       board: render_cards(stack['board'], min: 1),
  #     }
  #   end
  # end
  #
  # def render_hand(stack, player)
  #   return [empty_slot] if stack['hand'].empty?
  #
  #   stack['hand'].map { |card| (player == current_user) ? render_card(*card) : render_card_back(*card) }
  # end
  #
  # def render_cards(cards, min:)
  #   result = cards.map { |args| render_card(*args) }
  #   (min - cards.length).times { result << empty_slot }
  #   result
  # end
  #
  # def render_card(id = nil, card_id = nil, round = nil)
  #   card = card_id && lookup_card(card_id)
  #   return empty_slot unless card
  #
  #   card.merge('id' => id, 'visible' => 'face', round: round)
  # end
  #
  # def render_card_back(id = nil, card_id = nil, round = nil)
  #   card = card_id && lookup_card(card_id)
  #   return empty_slot unless card
  #
  #   {
  #     id: id,
  #     deck: card['deck'],
  #     visible: 'back'
  #   }
  # end
  #
  # def empty_slot
  #   {
  #     id: SecureRandom.uuid,
  #     visible: 'slot'
  #   }
  # end
  #
  # def lookup_card(card_id)
  #   @cards ||= game.game_config.decks.values.inject(&:merge)
  #   @cards[card_id]
  # end
end
