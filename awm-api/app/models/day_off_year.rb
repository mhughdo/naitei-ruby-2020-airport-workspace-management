class DayOffYear < ApplicationRecord
  belongs_to :user

  scope :filter_time, ->(year){where year: year}
end
