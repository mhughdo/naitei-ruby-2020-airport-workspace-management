class CreateDayOffMonths < ActiveRecord::Migration[6.0]
  def change
    create_table :day_off_months do |t|
      t.integer :year
      t.integer :month
      t.integer :awol
      t.integer :leave
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
