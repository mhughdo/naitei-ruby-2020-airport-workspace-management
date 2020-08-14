class UserStatus < ApplicationRecord
  has_many :users, dependent: :restrict

  validates :name, presence: true, uniqueness: true, allow_nil: true
  validates :disabled, presence: true,
    inclusion: {in: [true, false]}
end
