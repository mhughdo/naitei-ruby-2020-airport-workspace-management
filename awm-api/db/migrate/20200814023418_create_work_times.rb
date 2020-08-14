class CreateWorkTimes < ActiveRecord::Migration[6.0]
  def change
    create_table :work_times do |t|
      t.integer :time_start
      t.integer :time_end
      t.references :user, null: false, foreign_key: true
      t.references :work_time_status, null: false, foreign_key: true
      t.references :shift, null: false, foreign_key: true

      t.timestamps
    end
  end
end
