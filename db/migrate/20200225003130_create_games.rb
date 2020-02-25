class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games, id: :uuid do |t|
      t.references :game_config, type: :uuid, null: false, foreign_key: true
      t.jsonb :cards
      t.integer :sprint, default: 0
      t.uuid :next_action

      t.timestamps
    end
  end
end
