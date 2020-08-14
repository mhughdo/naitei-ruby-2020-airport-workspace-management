class RequestStatus < ApplicationRecord
  has_many :requests, dependent: :restrict

  validates :name, presence: true,
    allow_nil: false,
    uniqueness: true
  validates :disabled, presence: true,
    inclusion: {in: [true, false]}
end
