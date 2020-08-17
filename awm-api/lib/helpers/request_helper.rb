module RequestHelper
  def request_body permit_params = nil
    params = ActionController::Parameters.new JSON.parse(request.body.read)
    return params.permit! unless permit_params

    params.permit permit_params
  end
end
