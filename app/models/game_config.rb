class GameConfig < ApplicationRecord
  def as_json(*)
    hash = super
    # byebug
    hash['decks'].each do |deck, cards|
      hash['decks'][deck] = hash['decks'][deck].values.sort_by { |card| card['name'].downcase }
      hash['decks'][deck].each { |card| card['actions'] = (card['actions'] || []).join('') }
    end
    hash
  end

  def update_card(card_params)
    card_params['actions'] = (card_params['actions'] || '').split(/\r?\n/).flatten
    card_params['id'] = SecureRandom.uuid unless card_params['id'].present?
    return false if card_params['deck'].blank?

    deck = self.decks[card_params['deck']]
    deck[card_params['id']] = card_params

    save!

    true
  end
end
