class CreateEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :events, id: :uuid do |t|
      t.references :game, null: false, foreign_key: true, type: :uuid
      t.bigserial :order, null: false, index: true, unique: true
      t.string :user, null: false
      t.string :event_type, null: false
      t.string :object_ref, null: false
      t.jsonb :data

      t.timestamps
    end
  end
end
