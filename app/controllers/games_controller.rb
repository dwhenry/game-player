class GamesController < ApplicationController
  def show
    @game = {
      id: params[:id],
      name: 'Test Game 1',
      game_id: SecureRandom.uuid,
      cards: {
        id1: { id: :id1, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'd1' },
        id2: { id: :id2, title: 'Minor Refactor', cost: 3, actions: [nil, '+1 WU', '+1 WU'], deck: 'd2' },
      },
      locations: [
        {
          name: 'tasks',
          limit: 4,
          items: [
            { type: 'stack', cards: [:id1, :id2] },
            { type: 'discard', cards: [:id1] },
            { type: 'location', card: :id2, display: 'FU' },
            { type: 'location', card: nil, display: nil }
          ],
          type: 'stack',
          cards: { id1: 'FU', id2: 'FD', id3: 'Player ID' }
        }
      ],
      players: [
        { id: 'p1', name: 'David', hand: [:id1], fu: [:id2] },
        { id: 'p2', name: 'John', hand: [], fu: [] },
      ],
      log: ['......', '.......']
    }
  end
end
