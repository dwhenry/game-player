class UpdateGameClassToSimplifyFe < ActiveRecord::Migration[6.0]
  def change
    Game.delete_all

    remove_column :games, :next_action
    add_column :games, :params, :jsonb
    add_column :games, :players, :jsonb
    add_column :games, :name, :string
    add_column :games, :state, :string
  end
end
