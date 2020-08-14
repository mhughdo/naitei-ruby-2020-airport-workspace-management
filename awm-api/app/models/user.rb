class User < ApplicationRecord
  VALID_EMAIL_REGEX = Settings.validations.user.email.regex

  belongs_to :shift
  belongs_to :position
  belongs_to :user_status
  belongs_to :unit
  belongs_to :gender
  has_many :work_times, dependent: :destroy
  has_many :passive_notifications, class_name: Notification.name,
    foreign_key: :sender_id,
    dependent: :destroy
  has_many :active_notifications, class_name: Notification.name,
    foreign_key: :receiver_id,
    dependent: :destroy
  has_many :notifications, through: :passive_notifications, source: :receiver
  has_many :sent_notifications, through: :active_notifications, source: :sender
  has_many :passive_notifications, class_name: Request.name,
    foreign_key: :approver_id,
    dependent: :destroy
  has_many :active_notifications, class_name: Request.name,
    foreign_key: :requester_id,
    dependent: :destroy
  has_many :approved_requests, through: :passive_notifications, source: :approver
  has_many :requests, through: :active_notifications, source: :requester

  validates :name, presence: true,
    length: {maximum: Settings.validations.user.name.max_length}
  validates :email, presence: true,
    length: {maximum: Settings.validations.user.email.max_length},
    format: {with: VALID_EMAIL_REGEX},
    uniqueness:  {case_sensitive: false}
  validates :password, presence: true,
    allow_nil: true,
    length: {minimum: Settings.validations.user.password.min_length}
  validates :address, presence: true,
    allow_nil: true,
    length: {max_length: Settings.validations.user.address.max_length}

  before_save :downcase_email

  has_secure_password

  private

  def downcase_email
    email.downcase!
  end
end
