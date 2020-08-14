class AddGenderToUser < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :gender, null: false, foreign_key: true
  end
end
