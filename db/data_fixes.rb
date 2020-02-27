class DataFixes
  # This is just a series of datafixes that have been needed and a central place to store them for reference
  def flatten_actions_object
    GameConfig.all.each {|gc| gc.decks.each {|name, d| d.each {|_id, card| card['actions'] = card['actions'].flatten } }; gc.save }
  end

  def remove_lending_comma_from_actions
    GameConfig.all.each {|gc| gc.decks.each {|name, d| d.each {|_id, card| card['actions'] = card['actions'].map{|a| a.gsub(/^,/, '')} } }; gc.save }
  end

  def add_g_to_costs
    GameConfig.all.each {|gc| gc.decks.each {|name, d| d.each {|_id, card| card['cost'] = "#{card['cost']}G" } }; gc.save }
  end

  def add_rounds_to_cards
    GameConfig.all.each {|gc| gc.decks.each {|name, d| d.each {|_id, card| card['rounds'] = rand(1..3) } }; gc.save }
  end

  def purge_games
    Game.delete_all
  end
end
