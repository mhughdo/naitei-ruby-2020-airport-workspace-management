class Unit < ApplicationRecord
  has_many :users, dependent: :restrict
  has_many :requests, dependent: :restrict

  validates :name, presence: true,
    allow_nil: false,
    uniqueness: {case_sensitive: false}
  validates :description, presence: true,
    allow_nil: true,
    length: {max_length: Settings.validations.unit.description.max_length}
  validates :disabled, presence: true,
    inclusion: {in: [true, false]}
end
