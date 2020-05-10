class Game < ApplicationRecord
  PENDING_PLAYER = "__FUCK YOU_PHILE__#{ENV['PENDING_PLAYER_SECRET']}"

  belongs_to :game_config
  has_many :card_objects, class_name: 'Card'

  def ready?
    players.detect { |_, v| v == PENDING_PLAYER }.nil?
  end

  def play
    with_lock('FOR UPDATE NOWAIT') do
      cards.each_with_index do |card, i|
        card_objects.create(
          card.merge(last_move_id: i)
        )
      end
      update(state: 'playing')
    end
  end

  def archive
    with_lock('FOR UPDATE NOWAIT') do
      self.cards = keyframe
      self.state = 'archived'
      save!
      card_objects.destroy_all
    end
  end

  def keyframe
    card_objects.map do |card|
      card.attributes.except("last_move_id", "created_at", "updated_at")
    end
  end

  def join(username)
    return if players.any? { |_, v| v == username }

    key, _ = players.detect { |_, v| v == PENDING_PLAYER }
    players[key] = username

    self.state = 'ready-to-play' if ready?

    save!
  end
end
