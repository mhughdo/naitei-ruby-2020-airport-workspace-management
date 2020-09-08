FactoryBot.define do
  factory :user, aliases: [:receiver, :sender, :requester, :approver] do
    name {Faker::Name.name}
    email {Faker::Internet.email}
    channel {Time.now.to_i.to_s}
    birthday {Faker::Number.number(digits: 10).to_s} 
    password {Settings.password_test}
    password_confirmation {Settings.password_test}
    phone {Faker::Number.number(digits: 10).to_s}
    address {Faker::Address.full_address}
    shift_id {FactoryBot.create(:shift).id}
    position_id {FactoryBot.create(:position).id}
    user_status_id {FactoryBot.create(:user_status).id}
    unit_id {FactoryBot.create(:unit).id}
    gender_id {FactoryBot.create(:gender).id}
  end
end
