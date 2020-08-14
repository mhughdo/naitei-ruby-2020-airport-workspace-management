class Notification < ApplicationRecord
  belongs_to :sender, class_name: User.name
  belongs_to :receiver, class_name: User.name

  validates :name, presence: true,
    length: {maximum: Settings.validations.notification.name.max_length}
  validates :content, presence: true,
    allow_nil: false,
    length: {maximum: Settings.validations.notification.content.max_length}
  validates :sender_id, presence: true,
    allow_nil: true
  validates :receiver_id, presence: true,
    allow_nil: false
end
