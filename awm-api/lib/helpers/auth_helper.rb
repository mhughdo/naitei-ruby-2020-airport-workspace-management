module AuthHelper
  def set_cookie token
    cookies[:token] = {
      value: token,
      expires: Settings.expire_token_time.years.from_now,
      path: "/api/v1",
      secure: Rails.env.production?,
      httponly: Rails.env.production?
    }
  end

  def encode_token payload
    JWT.encode(payload, ENV["SECRET_KEY"])
  end

  def decoded_token
    return unless auth_header

    token = auth_header
    begin
      JWT.decode(token, ENV["SECRET_KEY"], true, algorithm: ENV["JWT_ALGORITHM"])
    rescue JWT::DecodeError
      nil
    end
  end

  def current_user
    return unless decoded_token

    user_id = decoded_token[0][:user_id]
    @user = User.find_by id: user_id
  end

  def auth_header
    request.headers["Authorization"]
  end

  def authorized
    error!(I18n.t("request.login"), :unauthorized) unless logged_in?
  end

  private

  def logged_in?
    current_user.present?
  end
end
