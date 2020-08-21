# rubocop:disable Metrics/BlockLength
class ResetPasswordApi < ApiV1
  namespace :auth do
    namespace :password do
      before do
        @user = get_user_by_email
      end

      desc "Create request to reset password"
      params do
        requires :email, type: String, message: I18n.t("errors.required")
      end
      post "/reset" do
        @user.create_reset_digest
        @user.send_password_reset_email
        return render_notification(:ok, I18n.t("success.sent_reset_password_mail"))
      end

      desc "Update password"
      params do
        requires :email, type: String, message: I18n.t("errors.required")
        requires :token, type: String, message: I18n.t("errors.required")
        requires :password, type: String, message: I18n.t("errors.required")
        requires :password_confirmation, type: String, message: I18n.t("errors.required")
      end
      put "/update" do
        valid_reset_password_token @user
        check_expiration @user
        check_blank_password
        check_password_confirmation
        if @user.update(password: params[:password], reset_digest: nil)
          token = encode_token({user_id: @user.id})
          set_cookie token
          return render_success_response(:ok, AuthFormat, {token: token, user: @user}, I18n.t("success.reset_password"))
        else
          error!(I18n.t("errors.something_wrong"), :bad_request)
        end
      end

      desc "Check valid reset password token"
      params do
        requires :token, type: String
        requires :email, type: String
      end
      post "/valid-reset-token" do
        valid_reset_password_token @user
        check_expiration @user
        return render_notification(:ok, I18n.t("success.valid_reset_password_token"))
      end
    end
  end
end
# rubocop:enable Metrics/BlockLength
