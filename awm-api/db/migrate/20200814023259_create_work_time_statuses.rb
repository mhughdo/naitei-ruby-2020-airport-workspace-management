class CreateWorkTimeStatuses < ActiveRecord::Migration[6.0]
  def change
    create_table :work_time_statuses do |t|
      t.string :name
      t.boolean :disabled, default: false
      
      t.timestamps
    end
  end
end
