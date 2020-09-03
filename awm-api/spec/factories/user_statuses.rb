FactoryBot.define do
  factory :user_status do
    name {Faker::Name.name}
    active {Faker::Boolean.boolean}
  end
end
