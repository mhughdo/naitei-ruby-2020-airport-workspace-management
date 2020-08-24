class RequestApi < ApiV1
  # rubocop:disable Metrics/BlockLength
  namespace :requests do
    before do
      authenticated
    end

    desc "Create new request form"
    params do
      requires :reason, type: String, message: I18n.t("errors.required")
      requires :absence_day, type: Integer, message: I18n.t("errors.required")
    end
    post "/new" do
      params[:unit_id] = current_user.unit_id
      params[:requester_id] = current_user.id
      params[:approver_id] = User.get_unit_manager(current_user.unit_id).id || 1
      params[:request_status_id] = authorized_position_one_of(%w(Admin Manager)) ? 2 : 1

      request = Request.create params
      return render_success_response(:ok, RequestFormat, request, I18n.t("success.request")) if request.valid?

      error!(request.full_messages[0], :bad_request)
    end

    desc "Update request form"
    params do
      optional :reason, type: String
      optional :absence_day, type: String, allow_blank: false
    end
    put "/:id/update" do
      valid_user(params[:id])
      if request = Request.update(params[:id], params.except!(:id))
        render_success_response(:ok, RequestFormat, request, I18n.t("success.update"))
      else
        error!(I18n.t("errors.update"), :bad_request)
      end
    end
  end
  # rubocop:enable Metrics/BlockLength
end
