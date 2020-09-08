class CreateRequests < ActiveRecord::Migration[6.0]
  def change
    create_table :requests do |t|
      t.integer :requester_id
      t.integer :approver_id
      t.string :absence_days
      t.string :reason
      t.string :comment
      t.references :unit, null: false, foreign_key: true
      t.references :request_status, null: false, foreign_key: true

      t.timestamps
    end
  end
end
