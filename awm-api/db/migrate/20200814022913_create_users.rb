class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :birthday
      t.string :phone
      t.string :password_digest
      t.string :remember_digest
      t.string :reset_digest
      t.datetime :reset_sent_at
      t.string :address
      t.datetime :shift_updated_at
      t.references :shift, null: false, foreign_key: true
      t.references :position, null: false, foreign_key: true
      t.references :user_status, null: false, foreign_key: true
      t.references :unit, null: false, foreign_key: true

      t.timestamps
    end
  end
end
