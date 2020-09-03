FactoryBot.define do
  factory :notification do
    receiver_id {FactoryBot.create(:receiver).id}
    sender_id {FactoryBot.create(:sender).id}
    name {Faker::Name.name}
    content {Faker::String.random(length: 3..100)}
  end
end
