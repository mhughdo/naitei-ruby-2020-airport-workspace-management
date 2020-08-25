class Position < ApplicationRecord
  has_many :users, dependent: :nullify

  scope :active, ->{where active: true}

  validates :name, presence: true,
    allow_nil: false,
    uniqueness: true
  validates :active, inclusion: {presence: true, in: [true, false]}
end
