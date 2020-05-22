class AddNameToConfig < ActiveRecord::Migration[6.0]
  def change
    add_column :game_configs, :name, :string

    GameConfig.reset_column_information
    GameConfig.update_all("name = 'Unnamed Game: ' || substr(id::varchar,1,6)")
  end
end
