class WorkTime < ApplicationRecord
  belongs_to :user
  belongs_to :work_time_status
  belongs_to :shift

  validates :time_start, presence: true,
    allow_nil: false
  validates :time_end, presence: true,
    allow_nil: false
end
