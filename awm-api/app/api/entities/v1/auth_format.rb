class AuthFormat < Grape::Entity
  expose :data do
    expose :token
    expose :user, using: PrivateUserFormat
  end
  expose :message do |_users, options|
    options[:message]
  end
end
