RSpec.shared_examples "create example shift" do
  before do
    FactoryBot.create(
      :shift,
      name: "Shift 1",
      time_start: "1598911988",
      time_end: "1598853867",
      active: true
    )
    FactoryBot.create(
      :shift,
      name: "Shift 2",
      time_start: "1598911988",
      time_end: "1598853867",
      active: true
    )
    FactoryBot.create(
      :shift,
      name: "Shift 3",
      time_start: "1598911988",
      time_end: "1598853867",
      active: true
    )
  end
end
