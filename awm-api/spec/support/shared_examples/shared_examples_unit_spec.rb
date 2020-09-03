RSpec.shared_examples "create example unit" do
  before do
    FactoryBot.create(
      :unit,
      name: "HR",
      description: "Employee management",
      active: true
    )
    FactoryBot.create(
      :unit,
      name: "BA",
      description: "Employee management",
      active: true
    )
    FactoryBot.create(
      :unit,
      name: "Store management",
      description: "Employee management",
      active: true
    )
  end
end
