class Api::V1::UsersController < ApplicationController
  before_action :authorized, except: :create

  def create
    @user = User.create_user user_params
    if @user.valid?
      token = encode_token({user_id: @user.id})
      set_cookie token
      render_success_response(:created, {token: token}, I18n.t("success.signup"))
    else
      render_fail_response(:unauthorized, @user.errors.full_messages)
    end
  end

  private

  def user_params
    request_body User::PARAMS
  end
end
