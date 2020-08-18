class ApplicationController < ActionController::API
  include HttpAcceptLanguage::AutoLocale
  include AuthHelper
  include RequestHelper
  include ResponseHelper

  before_action :authorized

  def default_url_options
    {locale: I18n.locale}
  end

  def current_user
    return unless decoded_token

    user_id = decoded_token[0][:user_id]
    @user = User.find_by id: user_id
  end

  private

  def logged_in?
    !!current_user
  end

  def authorized
    render json: {message: I18n.t("request.login")}, status: :unauthorized unless logged_in?
  end
end
