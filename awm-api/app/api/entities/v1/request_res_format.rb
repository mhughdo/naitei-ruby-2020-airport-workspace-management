class RequestResFormat < Grape::Entity
  expose :data, using: RequestFormat
  expose :message do |_users, options|
    options[:message]
  end
end
