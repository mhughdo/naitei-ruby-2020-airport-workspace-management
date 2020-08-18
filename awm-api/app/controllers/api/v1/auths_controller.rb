class Api::V1::AuthsController < ApplicationController
  before_action :authorized, except: :create

  def create
    @user = User.find_by email: auth_params[:email]
    return render_fail_response(:unauthorized, [I18n.t("errors.email_not_found")]) unless @user

    if @user&.authenticate auth_params[:password]
      token = encode_token({user_id: @user.id})
      set_cookie token
      render_success_response(:ok, {token: token}, [I18n.t("success.login")])
    else
      render_fail_response(:unauthorized, [I18n.t("errors.incorrect_password")])
    end
  end

  private

  def auth_params
    request_body User::LOGIN_PARAMS
  end
end
