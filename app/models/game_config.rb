class GameConfig < ApplicationRecord
  def as_json(*)
    # TODO: Fix data model to avoid needing this...
    hash = super
    hash['cards'] = hash.delete('decks').flat_map {|_deck, cards| cards.values }.sort_by { |card| card['name'].downcase }
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
