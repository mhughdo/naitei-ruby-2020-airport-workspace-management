require "rails_helper"

RSpec.describe Notification, type: :model do
  let!(:notification) {FactoryBot.create :notification}
  let!(:notification_fail) {FactoryBot.build :notification, content: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(notification.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(notification_fail.valid?).to eq false
      end
    end
  end

  describe "Associations" do
    it "should has many users" do
      is_expected.to belong_to :receiver
      is_expected.to belong_to :sender
    end
  end
end
