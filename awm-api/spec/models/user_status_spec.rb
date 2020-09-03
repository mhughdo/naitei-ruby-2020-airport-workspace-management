require "rails_helper"

RSpec.describe UserStatus, type: :model do
  let!(:user_status) {FactoryBot.create :user_status}
  let!(:user_status_fail) {FactoryBot.build :user_status, name: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(user_status.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(user_status_fail.valid?).to eq false
      end
    end
  end

  describe "Associations" do
    it "should has many users" do
      is_expected.to have_many(:users).dependent :nullify
    end
  end
end
