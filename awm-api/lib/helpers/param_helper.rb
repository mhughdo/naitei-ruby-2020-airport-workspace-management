module ParamHelper
  def valid_params params, permit_params
    params.as_json only: permit_params
  end
end
