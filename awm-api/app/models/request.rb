class Request < ApplicationRecord
  UPDATE_FORM_PARAMS = %i(reason absence_day).freeze

  belongs_to :unit
  belongs_to :request_status
  belongs_to :requester, class_name: User.name
  belongs_to :approver, class_name: User.name

  scope :filter_unit, ->(unit_id){where unit_id: unit_id}
  scope :filter_requester, ->(requester_id){where requester_id: requester_id}

  delegate :name, to: :unit, prefix: true
  delegate :name, to: :request_status, prefix: true
  delegate :name, to: :requester, prefix: true
  delegate :name, to: :approver, prefix: true

  validates :reason, presence: true,
    length: {maximum: Settings.validations.request.reason.max_length},
    allow_nil: false
  validates :absence_day, presence: true,
    allow_nil: false
  validates :comment, presence: true,
    length: {maximum: Settings.validations.request.comment.max_length},
    allow_nil: true
  validates :requester_id, presence: true,
    allow_nil: false
  validates :approver_id, presence: true,
    allow_nil: true
end
