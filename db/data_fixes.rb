class DataFixes
  # This is just a series of datafixes that have been needed and a central place to store them for reference
  def flatten_actions_object
    GameConfig.all.each {|gc| gc.decks.each {|name, d| d.each {|_id, card| card['actions'] = card['actions'].flatten } }; gc.save }
  end

  def remove_lending_comma_from_actions
    GameConfig.all.each {|gc| gc.decks.each {|name, d| d.each {|_id, card| card['actions'] = card['actions'].map{|a| a.gsub(/^,/, '')} } }; gc.save }
  end

  def purge_games
    Game.delete_all
  end
end
