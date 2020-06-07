class RenameObjectRefToObjectLocator < ActiveRecord::Migration[6.0]
  def change
    rename_column :events, :object_ref, :object_locator
  end
end
