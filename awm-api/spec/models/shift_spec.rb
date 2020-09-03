require "rails_helper"

RSpec.describe Shift, type: :model do
  let(:shift) {FactoryBot.create :shift}
  let!(:shift_fail) {FactoryBot.build :shift, time_start: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(shift.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(shift_fail.valid?).to eq false
      end
    end
  end

  describe "Associations" do
    it "should has many users" do
      is_expected.to have_many(:users).dependent :nullify
    end
  end

  describe "Scopes" do
    include_examples "create example shift"

    context "when filtered active shift" do
      it "should return 3 shift" do
        expect(Shift.active.size).to eq 3
      end
    end
  end
end
