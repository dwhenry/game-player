class GamesController < ApplicationController
  def show
    @game = {
      id: params[:id],
      name: 'Test Game 1',
      game_id: SecureRandom.uuid,
      locations: [
        {
          id: :l1,
          name: 'Tasks',
          deck: 'task',
          items: [
            { id: :i1, type: 'stack', count: 10 },
            { id: :i2, type: 'Discard', cards: [{ id: :id11, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'task', visible: true }] },
            { id: :id1, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'task', visible: true },
            { id: :id2, title: 'Major Refactor', cost: 6, actions: [nil, '+1 WU', '+1 WU'], deck: 'task', visible: true }
          ],
        },
        {
          id: :l2,
          name: 'Achievements',
          deck: 'achievement',
          items: [
            { id: :i5, type: 'stack', count: 10 },
            { id: :i6, type: 'Discard', cards: [{ id: :id9, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'achievement', visible: true }] },
            { id: :id3, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'achievement', visible: true },
            { id: :id4, title: 'Major Refactor', cost: 6, actions: [nil, '+1 WU', '+1 WU'], deck: 'achievement', visible: true }
          ],
        },
        {
          id: :l3,
          name: 'Employee\'s',
          deck: 'employee',
          items: [
            { id: :i3, type: 'stack', count: 10 },
            { id: :i4, type: 'Discard', cards: [{ id: :id10, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'employee', visible: true }] },
            { id: :id5, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'employee', visible: true },
            { id: :id6, title: 'Major Refactor', cost: 6, actions: [nil, '+1 WU', '+1 WU'], deck: 'employee', visible: true }
          ],
        }

      ],
      players: [
        { id: 'p1', name: 'David',
          hand: [{ id: :id8, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'employee', visible: true }],
          fu_cards: [{ id: :id7, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'employee', visible: true}], tokens: {} },
        { id: 'p2', name: 'John', hand: [{deck: 'employee'}], fu_cards: [{deck: 'task'}], tokens: { cash: 10, energy: 12, achievement: 4 } },
      ],
      log: ['......', '.......']
    }
  end
end
