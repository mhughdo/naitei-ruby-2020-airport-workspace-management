class CreateUnits < ActiveRecord::Migration[6.0]
  def change
    create_table :units do |t|
      t.string :name
      t.string :description
      t.boolean :disabled, default: false
      
      t.timestamps
    end
  end
end
