module LocaleHelper
  def set_locale
    I18n.locale = cookies["next-i18next"] || request.headers["Accept-Language"] || I18n.default_locale
  end

  def default_url_options
    {locale: I18n.locale}
  end
end
