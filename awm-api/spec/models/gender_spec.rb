require "rails_helper"

RSpec.describe Gender, type: :model do
  let!(:gender) {FactoryBot.create :gender}
  let!(:gender_fail) {FactoryBot.build :gender, name: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(gender.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(gender_fail.valid?).to eq false
      end
    end
  end

  describe "Associations" do
    it "should has many users" do
      is_expected.to have_many(:users).dependent :nullify
    end
  end
end
