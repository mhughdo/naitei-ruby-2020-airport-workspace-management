class User < ApplicationRecord
  VALID_EMAIL_REGEX = Settings.validations.user.email.regex
  PARAMS = %i(name email password password_confirmation gender_id \
    shift_id position_id unit_id birthday address phone).freeze
  LOGIN_PARAMS = %i(email password).freeze
  PASSWORD_RESET_PARAMS = %i(email password password_confirmation).freeze
  UPDATE_PROFILE_PARAMS = %i(name email gender_id shift_id position_id unit_id address phone birthday).freeze
  LIMIT_UPDATE_PROFILE_PARAMS = %i(name email gender_id shift_id unit_id address phone birthday).freeze

  attr_accessor :reset_token

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
  has_many :passive_requests, class_name: Request.name,
    foreign_key: :approver_id,
    dependent: :destroy
  has_many :active_requests, class_name: Request.name,
    foreign_key: :requester_id,
    dependent: :destroy
  has_many :approved_requests, through: :passive_requests, source: :approver
  has_many :requests, through: :active_requests, source: :requester

  scope :get_manager, ->{where position_id: Settings.manager_id}
  scope :get_unit, ->(unit_id){where(unit_id: unit_id)}
  scope :get_unit_manager, ->(unit_id){User.get_unit(unit_id).get_manager}

  delegate :name, to: :gender, prefix: true
  delegate :name, to: :position, prefix: true
  delegate :name, to: :unit, prefix: true
  delegate :name, to: :shift, prefix: true
  delegate :name, to: :user_status, prefix: true

  validates :name, presence: true,
    length: {maximum: Settings.validations.user.name.max_length}
  validates :email, presence: true,
    length: {maximum: Settings.validations.user.email.max_length},
    format: {with: VALID_EMAIL_REGEX},
    uniqueness:  {case_sensitive: false}
  validates :address, presence: true,
    allow_nil: true,
    length: {maximum: Settings.validations.user.address.max_length}
  validates :birthday, presence: true,
    allow_nil: true
  validates :phone, presence: true,
    allow_nil: true

  before_save :downcase_email

  has_secure_password

  class << self
    def digest string
      cost =
        if ActiveModel::SecurePassword.min_cost
          BCrypt::Engine::MIN_COST
        else
          BCrypt::Engine.cost
        end
      BCrypt::Password.create(string, cost: cost)
    end

    def new_token
      SecureRandom.urlsafe_base64
    end
  end

  def create_reset_digest
    self.reset_token = User.new_token
    update reset_digest: User.digest(reset_token), reset_sent_at: Time.zone.now
  end

  def send_password_reset_email
    UserMailer.password_reset(self).deliver_now
  end

  def password_reset_expired?
    reset_sent_at < Settings.expire_token_time.hours.ago
  end

  def valid_reset_password? token
    digest = send :reset_digest
    return false unless digest

    BCrypt::Password.new(digest).is_password? token
  end

  private

  def downcase_email
    email.downcase!
  end
end
