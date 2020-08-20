class AuthFormat < Grape::Entity
  expose :data do
    expose :token
    expose :user, using: UserFormat
  end
  expose :message do |_users, options|
    options[:message]
  end
end
