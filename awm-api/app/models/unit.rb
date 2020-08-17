class Unit < ApplicationRecord
  has_many :users, dependent: :nullify
  has_many :requests, dependent: :nullify

  validates :name, presence: true,
    allow_nil: false,
    uniqueness: {case_sensitive: false}
  validates :description, presence: true,
    allow_nil: true,
    length: {maximum: Settings.validations.unit.description.max_length}
  validates :active, inclusion: {presence: true, in: [true, false]}
end
