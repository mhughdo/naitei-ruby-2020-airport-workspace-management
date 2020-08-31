FactoryBot.define do
  factory :position do
    name {Faker::Name.name}
    active {Faker::Boolean.boolean}
  end
end
