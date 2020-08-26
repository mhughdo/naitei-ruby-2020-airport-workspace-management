class GenderApi < ApiV1
  namespace :gender do
    before do
      authenticated
    end

    desc "Get gender types"
    get "/types" do
      types = Gender.all.active
      render_success_response(:ok, GenderFormat, types, I18n.t("success.common"))
    end
  end
end
