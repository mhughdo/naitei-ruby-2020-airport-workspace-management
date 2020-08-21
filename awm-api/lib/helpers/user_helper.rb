module UserHelper
  def get_user_by_email
    user = User.find_by email: params[:email]
    error!(I18n.t("errors.user_not_found"), :not_found) unless user
    user
  end

  def get_user_by_id
    user = User.find_by id: params[:id]
    error!(I18n.t("errors.user_not_found"), :not_found) unless user
    user
  end
end
