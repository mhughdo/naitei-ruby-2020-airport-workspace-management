FactoryBot.define do
  factory :request do
    requester_id {FactoryBot.create(:requester).id}
    approver_id {FactoryBot.create(:approver).id}
    absence_days {Faker::Number.number(digits: 10).to_s}
    reason {Faker::String.random(length: 3..100)}
    comment {Faker::String.random(length: 3..100)}
    unit_id {FactoryBot.create(:unit).id}
    request_status_id {FactoryBot.create(:request_status).id}
  end
end
