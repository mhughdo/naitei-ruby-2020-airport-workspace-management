class WorkTimeResFormat < Grape::Entity
  expose :data, using: WorkTimeFormat
  expose :message do |_users, options|
    options[:message]
  end
end
