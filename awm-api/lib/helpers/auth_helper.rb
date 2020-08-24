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

    user_id = decoded_token[0]["user_id"]
    user = User.find_by id: user_id
    error!(I18n.t("request.login"), :unauthorized) unless user
    user
  end

  def auth_header
    token = request.headers["Authorization"] || cookies[:token]
    error!(I18n.t("errors.auth_token_not_found"), :bad_request) unless token
    token
  end

  def authenticated
    error!(I18n.t("request.login"), :unauthorized) unless logged_in?
  end

  def authorized_one_of positions
    is_authorized = false
    positions.each do |position|
      if current_user.position_name == position
        is_authorized = true
        break
      end
    end
    is_authorized
  end

  def authorized_unit_one_of units
    is_authorized = false
    units.each do |unit|
      if current_user.unit_name == unit
        is_authorized = true
        break
      end
    end
    is_authorized
  end

  def authorized_position_one_of positions
    is_authorized = false
    positions.each do |position|
      if current_user.position_name == position
        is_authorized = true
        break
      end
    end
    is_authorized
  end

  private

  def logged_in?
    current_user.present?
  end
end
