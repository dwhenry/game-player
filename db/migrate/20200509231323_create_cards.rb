class CreateCards < ActiveRecord::Migration[6.0]
  def change
    create_table :cards, id: :uuid do |t|
      t.string :identity, index: true
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
  end
end
