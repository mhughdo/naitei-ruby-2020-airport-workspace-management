module AuthHelper
  def set_cookie token
    response.set_cookie(
      :jwt,
      {
        value: token,
        expires: Settings.expire_token_time.years.from_now,
        path: "/api/v1",
        secure: Rails.env.production?,
        httponly: Rails.env.production?
      }
    )
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

  def auth_header
    request.headers["Authorization"]
  end
end
