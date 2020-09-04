class CreateDayOffYears < ActiveRecord::Migration[6.0]
  def change
    create_table :day_off_years do |t|
      t.integer :year
      t.integer :day_off_left
      t.integer :awol
      t.integer :leave
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
