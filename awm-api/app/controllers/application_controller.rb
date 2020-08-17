class ApplicationController < ActionController::API
  include AuthHelper
  include RequestHelper
  include ResponseHelper

  before_action :authorized

  def current_user
    return unless decoded_token

    user_id = decoded_token[0]["user_id"]
    @user = User.find_by id: user_id
  end

  private

  def logged_in?
    !!current_user
  end

  def authorized
    render json: {message: "Please log in"}, status: :unauthorized unless logged_in?
  end
end
