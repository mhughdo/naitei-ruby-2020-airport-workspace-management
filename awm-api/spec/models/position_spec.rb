require "rails_helper"

RSpec.describe Position, type: :model do
  let!(:position) {FactoryBot.create :position}
  let!(:position_fail) {FactoryBot.build :position, name: nil}

  describe "Validation" do
    context "when all required fields given" do
      it "should be true" do
        expect(position.valid?).to eq true
      end
    end

    context "when missing required fields" do
      it "should be false" do
        expect(position_fail.valid?).to eq false
      end
    end
  end

  describe "Associations" do
    it "should has many users" do
      is_expected.to have_many(:users).dependent(:nullify)
    end
  end
end
