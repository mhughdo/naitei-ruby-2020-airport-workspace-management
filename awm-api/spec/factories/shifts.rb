FactoryBot.define do
  factory :shift do
    name {Faker::Name.name}
    time_start {Faker::Time.between(from: DateTime.now - 1, to: DateTime.now).to_i.to_s}
    time_end {Faker::Time.between(from: DateTime.now - 1, to: DateTime.now).to_i.to_s}
    active {Faker::Boolean.boolean}
  end
end
