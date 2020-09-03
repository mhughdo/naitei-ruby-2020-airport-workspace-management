require "rails_helper"

RSpec.describe WorkTimeStatus, type: :model do
  let!(:worktime_status) {FactoryBot.create :work_time_status}
  let!(:worktime_status_fail) {FactoryBot.build :work_time_status, name: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(worktime_status.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(worktime_status_fail.valid?).to eq false
      end
    end
  end

  describe "Associations" do
    it "should has many work times" do
      is_expected.to have_many(:work_times).dependent :nullify
    end
  end
end
