class Position < ApplicationRecord
  has_many :users, dependent: :restrict

  validates :name, presence: true,
    allow_nil: false,
    uniqueness: true
  validates :disabled, presence: true,
    inclusion: {in: [true, false]}
end
