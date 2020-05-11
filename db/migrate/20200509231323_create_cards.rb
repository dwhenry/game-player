class CreateCards < ActiveRecord::Migration[6.0]
  def change
    create_table :cards, id: :uuid do |t|
      t.references :game, null: false, foreign_key: true, type: :uuid
      t.string :card_id, index: true
      t.string :location_id, null: false
      t.string :stack, null: false
      t.integer :stage
      t.integer :last_move_id, null: false
      t.string :owner_id

      t.timestamps
    end

    add_index :cards, [:location_id, :stack, :last_move_id]
    add_index :cards, [:game_id, :last_move_id], unique: true # these are also AR validations
    add_index :cards, [:game_id, :owner_id], unique: true # these are also AR validations
  end
end
