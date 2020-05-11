class CreateUserLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :user_logs, id: :uuid do |t|
      t.references :game, null: false, foreign_key: true, type: :uuid
      t.string :user
      t.jsonb :logs

      t.timestamps
    end

    add_index :user_logs, [:game_id, :user], unique: true
  end
end
