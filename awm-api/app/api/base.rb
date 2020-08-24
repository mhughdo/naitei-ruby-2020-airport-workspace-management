class Base < Grape::API
  helpers LocaleHelper
  helpers AuthHelper
  helpers ResponseHelper
  helpers PasswordResetHelper
  helpers UserHelper
  helpers RequestHelper
  helpers ParamHelper

  before do
    set_locale
  end

  mount ApiV1
end
