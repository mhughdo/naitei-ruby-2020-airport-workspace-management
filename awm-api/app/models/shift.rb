class Shift < ApplicationRecord
  has_many :users, dependent: :restrict

  validates :time_start, presence: true,
    allow_nil: false
  validates :time_end, presence: true,
    allow_nil: false
  validates :disabled, presence: true,
    inclusion: {in: [true, false]}
end
