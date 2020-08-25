class Shift < ApplicationRecord
  has_many :users, dependent: :nullify

  scope :active, ->{where active: true}

  validates :time_start, presence: true,
    allow_nil: false
  validates :time_end, presence: true,
    allow_nil: false
  validates :active, inclusion: {presence: true, in: [true, false]}
end
