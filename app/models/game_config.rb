class GameConfig < ApplicationRecord
  def as_json(*)
    hash = super
    hash['decks'].each do |deck, _cards|
      hash['decks'][deck] = hash['decks'][deck].values.sort_by { |card| card['name'].downcase }
    end
    hash
  end

  def update_card(card_params)
    raise("Invalid Deck") unless self.decks.keys.include?(card_params['deck'])

    card_params['actions'].gsub!(/\r\n/, "\n")
    card_params['id'] = SecureRandom.uuid unless card_params['id'].present?
    return false if card_params['deck'].blank?

    self.decks.each { |_name, deck| deck.delete(card_params['id']) }

    deck = self.decks[card_params['deck']]
    deck[card_params['id']] = card_params

    save!

    card_params
  end
end
