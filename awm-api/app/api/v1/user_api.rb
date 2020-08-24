class UserApi < ApiV1
  # rubocop:disable Metrics/BlockLength
  namespace :auth do
    desc "Sign up, only admin can create account"
    params do
      requires :name, type: String, message: I18n.t("errors.required")
      requires :email, type: String, message: I18n.t("errors.required")
      requires :password, type: String, message: I18n.t("errors.required")
      requires :password_confirmation, type: String, same_as: :password, message: I18n.t("errors.required")
      requires :address, type: String, message: I18n.t("errors.required")
      requires :birthday, type: String, message: I18n.t("errors.required")
      requires :phone, type: String, message: I18n.t("errors.required")
      requires :gender_id, type: Integer, message: I18n.t("errors.required")
      requires :shift_id, type: Integer, message: I18n.t("errors.required")
      requires :position_id, type: Integer, message: I18n.t("errors.required")
      requires :unit_id, type: Integer, message: I18n.t("errors.required")
    end
    before do
      error!(I18n.t("errors.not_allowed"), :forbidden) unless authorized_one_of %w(Admin)
    end
    post "/signup" do
      data = valid_params(params, User::PARAMS)
      data[:user_status_id] = 1
      user = User.create data
      if user.valid?
        token = encode_token({user_id: user.id})
        set_cookie token
        return render_success_response(:ok, AuthFormat, {token: token, user: user}, I18n.t("success.signup"))
      else
        error!(user.errors.full_messages[0], :bad_request)
      end
    end
  end

  namespace :profile do
    before do
      authenticated
    end

    desc "Show profile"
    get "/" do
      return render_success_response(:ok, PrivateUserFormat, current_user, I18n.t("success.signup"))
    end
  end

  namespace :users do
    before do
      authenticated
    end

    desc "Only admin and BA can get all user information"
    get "/:id" do
      user = get_user_by_id
      is_allowed = authorized_one_of(%w(Admin)) || authorized_unit_one_of(%w(BA))
      return render_success_response(:ok, PrivateUserFormat, user, I18n.t("success.common")) if is_allowed

      render_success_response(:ok, PublicUserFormat, user, I18n.t("success.common"))
    end

    desc "Only BA unit member can update user profile"
    params do
      optional :name, type: String, allow_blank: false
      optional :email, type: String, allow_blank: false
      optional :address, type: String
      optional :birthday, type: String
      optional :phone, type: String
      optional :shift_id, type: String, allow_blank: false
      optional :position_id, type: String, allow_blank: false
      optional :unit_id, type: String, allow_blank: false
      optional :user_status_id, type: String, allow_blank: false
      optional :gender_id, type: String, allow_blank: false
    end
    put "/:id/update" do
      data = valid_params(params, User::UPDATE_PROFILE_PARAMS)
      error!(I18n.t("errors.not_allowed"), :forbidden) unless authorized_unit_one_of %w(BA)
      get_user_by_id
      if user = User.update(params[:id], data)
        render_success_response(:ok, PrivateUserFormat, user, I18n.t("success.update"))
      else
        error!(I18n.t("errors.update"), :bad_request)
      end
    end
  end
  # rubocop:enable Metrics/BlockLength
end
