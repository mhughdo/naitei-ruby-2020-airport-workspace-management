FactoryBot.define do
  factory :gender do
    name {Faker::Name.name}
    active {Faker::Boolean.boolean}
  end
end
