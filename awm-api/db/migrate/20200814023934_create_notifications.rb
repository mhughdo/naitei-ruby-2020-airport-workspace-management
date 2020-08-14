class CreateNotifications < ActiveRecord::Migration[6.0]
  def change
    create_table :notifications do |t|
      t.integer :receiver_id
      t.integer :sender_id
      t.string :name
      t.string :content

      t.timestamps
    end
  end
end
