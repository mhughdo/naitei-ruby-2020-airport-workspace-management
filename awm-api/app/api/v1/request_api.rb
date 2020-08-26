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
      manager = User.get_unit_manager(current_user.unit_id)[0]

      data = valid_params(params, Request::UPDATE_FORM_PARAMS)
      data[:unit_id] = current_user.unit_id
      data[:requester_id] = current_user.id
      data[:approver_id] = manager.present? ? manager.id : Settings.admin_account_id
      data[:request_status_id] = if authorized_position_one_of(%w(Admin Manager))
                                   Settings.approved_status_id
                                 else
                                   Settings.pending_status_id
                                 end

      request = Request.create data
      return render_success_response(:ok, RequestFormat, request, I18n.t("success.request")) if request.valid?

      error!(request.full_messages[0], :bad_request)
    end

    desc "Update request form"
    params do
      optional :reason, type: String
      optional :absence_day, type: String, allow_blank: false
    end
    put "/:id/update" do
      valid_user params[:id]
      valid_request params[:id]
      error!(I18n.t("errors.update"), :bad_request) unless request.request_status_id == Settings.pending_status_id

      data = valid_params(params, Request::UPDATE_FORM_PARAMS)
      if request = Request.update(params[:id], data)
        render_success_response(:ok, RequestFormat, request, I18n.t("success.update"))
      else
        error!(I18n.t("errors.update"), :bad_request)
      end
    end

    desc "Only Manager can approve request"
    put "/:id/approve" do
      valid_request params[:id]
      error!(I18n.t("errors.not_allowed"), :forbidden) unless authorized_one_of %w(Manager)

      request = Request.find_by id: params[:id]
      day = Time.zone.at(request.absence_day.to_i).day
      month = Time.zone.at(request.absence_day.to_i).month
      year = Time.zone.at(request.absence_day.to_i).year

      ActiveRecord::Base.transaction do
        if request.request_status_id != Settings.approved_status_id
          request.update!(request_status_id: Settings.approved_status_id)
          WorkTime.create!(
            user_id: request.requester_id,
            shift_id: request.requester.try(:shift_id),
            work_time_status_id: Settings.absence_status_id,
            time_start: nil,
            time_end: nil,
            day: day,
            month: month,
            year: year
          )
          raise ActiveRecord::Rollback unless worktime

          render_success_response(:ok, RequestFormat, request, I18n.t("success.update"))
        else
          error!(I18n.t("errors.already_approved"), :bad_request)
        end
        true
      end
    rescue ActiveRecord::RecordInvalid
      error!(I18n.t("errors.update"), :bad_request)
    end

    desc "Only Manager can reject request"
    put "/:id/reject" do
      valid_request params[:id]
      error!(I18n.t("errors.not_allowed"), :forbidden) unless authorized_one_of %w(Manager)
      request = Request.find_by id: params[:id]
      day = Time.zone.at(request.absence_day.to_i).day
      month = Time.zone.at(request.absence_day.to_i).month
      year = Time.zone.at(request.absence_day.to_i).year

      ActiveRecord::Base.transaction do
        if request.request_status_id != Settings.rejected_status_id
          request.update!(request_status_id: Settings.rejected_status_id)
          worktime = WorkTime.create!(
            user_id: request.requester_id,
            shift_id: request.requester.shift_id,
            work_time_status_id: Settings.absence_status_id,
            time_start: nil,
            time_end: nil,
            day: day,
            month: month,
            year: year
          )
          raise ActiveRecord::Rollback unless worktime

          render_success_response(:ok, RequestResFormat, {data: request}, I18n.t("success.update"))
        else
          error!(I18n.t("errors.already_rejected"), :bad_request)
        end
        true
      end
    rescue ActiveRecord::RecordInvalid
      error!(I18n.t("errors.update"), :bad_request)
    end
  end
  # rubocop:enable Metrics/BlockLength
end
