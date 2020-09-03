class ShiftApi < ApiV1
  namespace :shift do
    before do
      authenticated
    end

    desc "Get shift types"
    get "/types" do
      types = Shift.all.active
      render_success_response(:ok, ShiftFormat, types, I18n.t("success.common"))
    end
  end
end
