class WorkTimeApi < ApiV1
  namespace :work_times do
    desc "Get work times by year and month"
    before do
      authenticated
    end
    params do
      requires :year, type: Integer, message: I18n.t("errors.required")
      requires :month, type: Integer, message: I18n.t("errors.required")
    end
    get "/" do
      work_times = current_user.work_times.filter_year(params[:year]).filter_month(params[:month])
      render_success_response(:ok, WorkTimeResFormat, {data: work_times}, I18n.t("success.common"))
    end
  end
end
