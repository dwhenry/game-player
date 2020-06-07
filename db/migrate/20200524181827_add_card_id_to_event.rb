class AddCardIdToEvent < ActiveRecord::Migration[6.0]
  def change
    add_column :events, :card_id, :uuid, index: true
  end
end
