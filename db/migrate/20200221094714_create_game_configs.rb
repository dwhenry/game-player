class CreateGameConfigs < ActiveRecord::Migration[6.0]
  def change
    enable_extension 'pgcrypto'

    create_table :game_configs, id: :uuid do |t|
      t.jsonb :decks
      t.uuid :parent_id
      t.jsonb :rules
      t.boolean :locked, default: false, null: false

      t.timestamps
    end
  end
end
