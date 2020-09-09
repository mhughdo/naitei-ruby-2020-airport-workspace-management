class WorkTime < ApplicationRecord
  belongs_to :user
  belongs_to :work_time_status
  belongs_to :shift

  scope :filter_year, ->(year){where year: year}
  scope :filter_month, ->(month){where month: month}
  scope :filter_time, ->(year, month, day){where year: year, month: month, day: day}

  delegate :name, to: :work_time_status, prefix: true
  delegate :name, to: :shift, prefix: true

  validates :time_start, presence: true,
    allow_nil: true
  validates :time_end, presence: true,
    allow_nil: true
  validates :day, presence: true,
    allow_nil: false
  validates :month, presence: true,
    allow_nil: false
  validates :year, presence: true,
    allow_nil: false
end
