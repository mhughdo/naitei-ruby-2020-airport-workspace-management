class CreateShifts < ActiveRecord::Migration[6.0]
  def change
    create_table :shifts do |t|
      t.string  :name
      t.string :time_start
      t.string :time_end
      t.boolean :active, default: true
      
      t.timestamps
    end
  end
end
