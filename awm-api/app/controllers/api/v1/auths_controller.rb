class Api::V1::AuthsController < ApplicationController
  before_action :authorized, except: :create

  def create
    @user = User.find_by email: auth_params["email"]
    if @user&.authenticate auth_params["password"]
      token = encode_token({user_id: @user.id})
      set_cookie token
      render_success_response(:ok, {token: token}, "Login successfully")
    else
      render_fail_response(:unauthorized, @user.errors.full_messages)
    end
  end

  private

  def auth_params
    request_body User::LOGIN_PARAMS
  end
end
