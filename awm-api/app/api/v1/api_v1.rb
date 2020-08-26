class ApiV1 < Grape::API
  format :json
  prefix :api
  version "v1", using: :path

  mount AuthApi
  mount UserApi
  mount ResetPasswordApi
  mount RequestApi
  mount GenderApi
  mount PositionApi
  mount UnitApi
  mount ShiftApi
  mount WorkTimeApi
end
