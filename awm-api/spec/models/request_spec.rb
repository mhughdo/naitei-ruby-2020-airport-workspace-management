require "rails_helper"

RSpec.describe Request, type: :model do
  let!(:request) {FactoryBot.create :request}
  let!(:request_fail) {FactoryBot.build :request, reason: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(request.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(request_fail.valid?).to eq false
      end
    end
  end

  describe "Associations" do
    it "should belong to unit" do
      is_expected.to belong_to :unit
    end
    it "should belong to request status" do
      is_expected.to belong_to :request_status
    end
    it "should belong to requester" do
      is_expected.to belong_to :requester
    end
    it "should belong to approver" do
      is_expected.to belong_to :approver
    end
  end

  describe "Delegates" do
    it "should delegate to unit with method #name" do
      should delegate_method(:name).to(:unit).with_prefix
    end
    it "should delegate to request status with method #name" do
      should delegate_method(:name).to(:request_status).with_prefix
    end
    it "should delegate to requester with method #name" do
      should delegate_method(:name).to(:requester).with_prefix
    end
    it "should delegate to approver with method #name" do
      should delegate_method(:name).to(:approver).with_prefix
    end
  end
end
