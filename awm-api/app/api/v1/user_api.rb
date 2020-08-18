class UserApi < ApiV1
  namespace :auth do
    desc "Sign up"
    params do
      requires :name, type: String, message: I18n.t("errors.required")
      requires :email, type: String, message: I18n.t("errors.required")
      requires :password, type: String, message: I18n.t("errors.required")
      requires :password_confirmation, type: String, same_as: :password, message: I18n.t("errors.required")
      requires :gender_id, type: Integer, message: I18n.t("errors.required")
      requires :shift_id, type: Integer, message: I18n.t("errors.required")
      requires :position_id, type: Integer, message: I18n.t("errors.required")
      requires :unit_id, type: Integer, message: I18n.t("errors.required")
      requires :user_status_id, type: Integer, message: I18n.t("errors.required")
    end
    post "/signup" do
      @user = User.create params
      if @user.valid?
        token = encode_token({user_id: @user.id})
        set_cookie token
        return render_success_response(:ok, AuthFormat, {token: token, user: @user}, I18n.t("success.signup"))
      else
        error!(@user.errors.full_messages[0], :unauthorized)
      end
    end
  end
end
