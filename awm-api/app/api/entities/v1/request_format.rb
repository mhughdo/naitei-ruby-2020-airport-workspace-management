class RequestFormat < Grape::Entity
  expose :id
  expose :reason
  expose :absence_day
  expose :unit_name
  expose :requester_name
  expose :approver_name
  expose :request_status_name
  expose :comment
end
