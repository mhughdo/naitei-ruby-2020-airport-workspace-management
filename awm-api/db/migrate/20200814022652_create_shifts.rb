class CreateShifts < ActiveRecord::Migration[6.0]
  def change
    create_table :shifts do |t|
      t.integer :time_start
      t.integer :time_end
      t.boolean :disabled, default: false
      
      t.timestamps
    end
  end
end
