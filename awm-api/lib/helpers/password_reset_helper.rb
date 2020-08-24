module PasswordResetHelper
  def check_expiration user
    is_expired = user.password_reset_expired?
    error!(I18n.t("errors.expired_reset_password_token"), :bad_request) if is_expired
  end

  def check_blank_password
    error!(I18n.t("errors.blank_password"), :bad_request) if params[:password].blank?
  end

  def check_password_confirmation
    is_equal = params[:password] == params[:password_confirmation]
    error!(I18n.t("errors.incorrect_password_confirm"), :bad_request) unless is_equal
  end

  def valid_reset_password_token user
    activated_value = user&.valid_reset_password?(params[:token])
    error!(I18n.t("errors.invalid_reset_password_token"), :unauthorized) unless activated_value
  end
end
