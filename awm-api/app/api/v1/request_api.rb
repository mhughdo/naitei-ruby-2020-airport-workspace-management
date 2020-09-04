class RequestApi < ApiV1
  # rubocop:disable Metrics/BlockLength
  namespace :requests do
    before do
      authenticated
    end

    desc "Create new request form"
    params do
      requires :reason, type: String, message: I18n.t("errors.required")
      requires :absence_days, type: Array[String], message: I18n.t("errors.required")
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
      data[:absence_days] = ""
      params[:absence_days].each do |absence_day|
        data[:absence_days] << absence_day << ","
      end
      request = Request.create data
      if request.request_status_id == Settings.approved_status_id
        absence_days = request.absence_days.split(",")
        absence_days.each do |absence_day|
          time = Time.zone.at(absence_day.to_i)
          update_day_off(request.requester_id, time.year, time.month)
        end
      end

      return render_success_response :ok, RequestResFormat, {data: request}, I18n.t("success.request") if request.valid?

      error! request.full_messages[0], :bad_request
    end

    desc "Only valid user or manager of request unit can get request details"
    params do
      requires :request_id, type: Integer, message: I18n.t("errors.required")
    end
    get "/:request_id" do
      request = valid_request params[:request_id]
      unless valid_user(params[:request_id]) || valid_manager(params[:request_id])
        error! I18n.t("errors.not_allowed"), :forbidden
      end

      render_success_response :ok, RequestResFormat, {data: request}, I18n.t("success.common")
    end

    desc "Update request form"
    params do
      optional :reason, type: String
      optional :absence_day, type: String, allow_blank: false
    end
    put "/:id/update" do
      valid_user params[:id]
      valid_request params[:id]
      error! I18n.t("errors.update"), :bad_request unless request.request_status_id == Settings.pending_status_id

      data = valid_params(params, Request::UPDATE_FORM_PARAMS)
      if request = Request.update(params[:id], data)
        render_success_response(:ok, RequestResFormat, {data: request}, I18n.t("success.update"))
      else
        error! I18n.t("errors.update"), :bad_request
      end
    end

    desc "Only Manager can approve request"
    put "/:id/approve" do
      valid_request params[:id]
      error! I18n.t("errors.not_allowed"), :forbidden unless authorized_one_of %w(Manager)

      request = Request.find_by id: params[:id]
      absence_days = request.absence_days.split(",")
      ActiveRecord::Base.transaction do
        if request.request_status_id != Settings.approved_status_id
          request.update!(request_status_id: Settings.approved_status_id)
          absence_days.each do |absence_day|
            time = Time.zone.at(absence_day.to_i)
            if time < Time.now.to_i
              worktime = WorkTime.filter_time(time.year, time.month, time.day)[0]
              worktime.update!(
                work_time_status_id: Settings.absence_status_id,
                time_start: nil,
                time_end: nil
              )
            else
              WorkTime.create!(
                user_id: request.requester_id,
                shift_id: request.requester.try(:shift_id),
                work_time_status_id: Settings.absence_status_id,
                time_start: nil,
                time_end: nil,
                day: time.day,
                month: time.month,
                year: time.year
              )
            end
            update_day_off(request.requester_id, time.year, time.month)
          end

          render_success_response :ok, RequestFormat, request, I18n.t("success.update")
        else
          error! I18n.t("errors.already_approved"), :bad_request
        end
        true
      end
    rescue ActiveRecord::RecordInvalid
      error! I18n.t("errors.update"), :bad_request
    end

    desc "Only Manager can reject request"
    params do
      optional :comment, type: String
    end
    put "/:id/reject" do
      valid_request params[:id]
      error!(I18n.t("errors.not_allowed"), :forbidden) unless authorized_one_of %w(Manager)
      request = Request.find_by id: params[:id]
      if request.request_status_id != Settings.approved_status_id &&
         request.request_status_id != Settings.rejected_status_id
        request.update!(
          request_status_id: Settings.rejected_status_id,
          comment: params[:comment]
        )
      end
    end
  end

  namespace :unit do
    before do
      authenticated
    end

    desc "Get all unit requests"
    get "/requests" do
      error! I18n.t("errors.not_allowed"), :forbidden unless authorized_one_of %w(Manager)
      requests = Request.filter_unit(current_user.unit_id)
      return render_success_response :ok, RequestResFormat, {data: requests}, I18n.t("success.common")
    end
  end

  namespace :profile do
    before do
      authenticated
    end

    desc "Get all requests yourself"
    get "/requests" do
      requests = Request.filter_requester(current_user.id)
      return render_success_response :ok, RequestResFormat, {data: requests}, I18n.t("success.common")
    end
  end
  # rubocop:enable Metrics/BlockLength
end
