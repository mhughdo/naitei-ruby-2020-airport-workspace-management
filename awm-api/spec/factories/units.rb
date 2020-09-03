FactoryBot.define do
  factory :unit do
    name {Faker::Name.name}
    description {"blabla"}
    active {Faker::Boolean.boolean}
  end
end
