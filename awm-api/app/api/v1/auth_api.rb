class AuthApi < ApiV1
  namespace :auth do
    before do
      @user = get_user_by_email
    end

    desc "Log in"
    params do
      requires :email, type: String, message: I18n.t("errors.required")
      requires :password, type: String, message: I18n.t("errors.required")
    end
    post "/login" do
      if @user&.authenticate params[:password]
        token = encode_token({user_id: @user.id})
        set_cookie token
        return render_success_response(:ok, AuthFormat, {token: token, user: @user}, I18n.t("success.login"))
      else
        error!(I18n.t("errors.incorrect_password"), :unauthorized)
      end
    end
  end
end
