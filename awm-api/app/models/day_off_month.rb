class DayOffMonth < ApplicationRecord
  belongs_to :user

  scope :filter_time, ->(year, month){where year: year, month: month}
end
