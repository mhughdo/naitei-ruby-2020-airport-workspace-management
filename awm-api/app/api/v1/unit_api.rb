class UnitApi < ApiV1
  namespace :unit do
    before do
      authenticated
    end

    desc "Get unit types"
    get "/types" do
      types = Unit.all.active
      render_success_response(:ok, UnitFormat, types, I18n.t("success.common"))
    end
  end
end
