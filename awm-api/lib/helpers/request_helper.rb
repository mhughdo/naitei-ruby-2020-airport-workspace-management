module RequestHelper
  include AuthHelper

  def valid_user request_id
    request = valid_request request_id
    return if request.requester_id == current_user.id

    error!(I18n.t("errors.invalid_user"), :bad_request)
  end

  def valid_request request_id
    request = Request.find_by id: request_id
    error!(I18n.t("errors.request_id_not_found"), :bad_request) unless request
    request
  end
end
