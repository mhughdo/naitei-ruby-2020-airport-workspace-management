class UserMailer < ApplicationMailer
  def password_reset user
    @user = user
    mail to: user.email, subject: t("user_mailer.reset_password_title")
  end
end
