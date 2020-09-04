FactoryBot.define do
  factory :request_status do
    name {Faker::Name.name}
    active {Faker::Boolean.boolean}
  end
end
