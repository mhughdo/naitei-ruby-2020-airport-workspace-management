class CreateWorkTimes < ActiveRecord::Migration[6.0]
  def change
    create_table :work_times do |t|
      t.string :time_start
      t.string :time_end
      t.integer :year
      t.integer :month
      t.integer :day
      t.references :user, null: false, foreign_key: true
      t.references :work_time_status, null: false, foreign_key: true
      t.references :shift, null: false, foreign_key: true

      t.timestamps
    end
  end
end
