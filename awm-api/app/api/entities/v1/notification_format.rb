class NotificationFormat < Grape::Entity
  expose :message do |_data, options|
    options[:message]
  end
end
