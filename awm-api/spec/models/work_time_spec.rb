require "rails_helper"

RSpec.describe WorkTime, type: :model do
  let!(:worktime) {FactoryBot.create :work_time}
  let!(:worktime_fail) {FactoryBot.build :work_time, day: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(worktime.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(worktime_fail.valid?).to eq false
      end
    end
  end

  describe "Associations" do
    it "should belong to users" do
      is_expected.to belong_to :user
    end
    it "should belong to work time status" do
      is_expected.to belong_to :work_time_status
    end
    it "should belong to shift" do
      is_expected.to belong_to :shift
    end
  end

  describe "Delegates" do
    it "should delegate to work time status with method #name" do
      should delegate_method(:name).to(:work_time_status).with_prefix
    end
    it "should delegate to shift with method #name" do
      should delegate_method(:name).to(:shift).with_prefix
    end
  end
end
