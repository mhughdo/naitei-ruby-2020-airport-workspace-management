class WorkTimeStatus < ApplicationRecord
  has_many :work_times, dependent: :nullify

  validates :name, presence: true, uniqueness: true, allow_nil: false
  validates :active, inclusion: {presence: true, in: [true, false]}
end
