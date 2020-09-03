class PositionApi < ApiV1
  namespace :position do
    before do
      authenticated
    end

    desc "Get position types"
    get "/types" do
      types = Position.all.active
      render_success_response(:ok, PositionFormat, types, I18n.t("success.common"))
    end
  end
end
