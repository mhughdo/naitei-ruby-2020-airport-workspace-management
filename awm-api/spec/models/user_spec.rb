require "rails_helper"

RSpec.describe User, type: :model do
  let!(:user) {FactoryBot.create :user}
  let!(:user_fail) {FactoryBot.build :user, birthday: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(user.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(user_fail.valid?).to eq true
      end
    end
  end

  describe "Associations" do
    it "should belong to shift" do
      is_expected.to belong_to :shift
    end
    it "should belong to position" do
      is_expected.to belong_to :position
    end
    it "should belong to user status" do
      is_expected.to belong_to :user_status
    end
    it "should belong to unit" do
      is_expected.to belong_to :unit
    end
    it "should belong to gender" do
      is_expected.to belong_to :gender
    end
    it "should belong to gender" do
      is_expected.to have_many :work_times
    end
    it "should belong to gender" do
      is_expected.to have_many :notifications
    end
    it "should belong to gender" do
      is_expected.to have_many :sent_notifications
    end
    it "should belong to gender" do
      is_expected.to have_many :approved_requests
    end
    it "should belong to gender" do
      is_expected.to have_many :requests
    end
  end

  describe "Delegates" do
    it "should delegate to gender with method #name" do
      should delegate_method(:name).to(:gender).with_prefix
    end
    it "should delegate to position status with method #name" do
      should delegate_method(:name).to(:position).with_prefix
    end
    it "should delegate to unit with method #name" do
      should delegate_method(:name).to(:unit).with_prefix
    end
    it "should delegate to shift with method #name" do
      should delegate_method(:name).to(:shift).with_prefix
    end
    it "should delegate to user status with method #name" do
      should delegate_method(:name).to(:user_status).with_prefix
    end
  end
end
