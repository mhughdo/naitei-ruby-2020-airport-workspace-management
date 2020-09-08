FactoryBot.define do
  factory :day_off_year do
    year {Faker::Number.between(from: 2000, to: 2020)}
    awol {Faker::Number.between(from: 1, to: 5)}
    leave {Faker::Number.between(from: 1, to: 5)}
    user_id {FactoryBot.create(:user).id}
  end
end
