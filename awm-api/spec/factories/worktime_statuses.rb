FactoryBot.define do
  factory :work_time_status do
    name {Faker::Name.name}
    active {Faker::Boolean.boolean}
  end
end
