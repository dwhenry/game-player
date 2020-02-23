class GameConfig < ApplicationRecord
  def as_json(*)
    hash = super
    # byebug
    hash['decks'].each do |deck, cards|
      hash['decks'][deck] = hash['decks'][deck].values.sort_by { |card| card['name'].downcase }
    end
    hash
  end

  def update_card(card_params)
    card_params['actions'] = (card_params['actions'] || '').split("\n")
    card_params['id'] = SecureRandom.uuid unless card_params['id'].present?
    return false if card_params['deck'].blank?

    card_params['actions'] = card_params['actions'].split("\n")
    deck = self.decks[card_params['deck']]
    deck[card_params['id']] = card_params

    save!

    true
  end
end
