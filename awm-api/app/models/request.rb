class Request < ApplicationRecord
  belongs_to :unit
  belongs_to :request_status
  belongs_to :requester, class: User.name
  belongs_to :approver, class: User.name

  validates :reason, presence: true,
    length: {maximum: Settings.validations.request.reason.max_length}
  validates :comment, presence: true,
    length: {maximum: Settings.validations.request.comment.max_length}
  validates :requester_id, presence: true,
    allow_nil: false
  validates :approver_id, presence: true,
    allow_nil: true
end
