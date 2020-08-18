class RequestStatus < ApplicationRecord
  has_many :requests, dependent: :nullify

  validates :name, presence: true,
    allow_nil: false,
    uniqueness: true
  validates :active, inclusion: {presence: true, in: [true, false]}
end
