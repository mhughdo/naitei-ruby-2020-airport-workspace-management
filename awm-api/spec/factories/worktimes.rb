FactoryBot.define do
  factory :work_time do
    time_start {Faker::Name.name}
    time_end {Faker::Boolean.boolean}
    year {Faker::Number.between(from: 2000, to: 2020)}
    month {Faker::Number.between(from: 1, to: 12)}
    day {Faker::Number.between(from: 1, to: 28)}
    user_id {FactoryBot.create(:user).id}
    work_time_status_id {FactoryBot.create(:work_time_status).id}
    shift_id {FactoryBot.create(:shift).id}
  end
end
