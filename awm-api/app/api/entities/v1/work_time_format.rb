class WorkTimeFormat < Grape::Entity
  expose :id
  expose :time_start
  expose :time_end
  expose :work_time_status_name
  expose :shift_name
  expose :day
  expose :month
  expose :year
end
