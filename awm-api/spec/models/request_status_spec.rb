require "rails_helper"

RSpec.describe RequestStatus, type: :model do
  let!(:request_status) { FactoryBot.create :request_status}
  let!(:request_status_fail) {FactoryBot.build :request_status, name: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(request_status.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(request_status_fail.valid?).to eq false
      end
    end
  end

  describe "Associations" do
    it "should has many users" do
      is_expected.to have_many(:requests).dependent :nullify
    end
  end
end
