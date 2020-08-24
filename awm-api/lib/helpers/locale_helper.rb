module LocaleHelper
  def set_locale
    locale = cookies["next-i18next"] || request.headers["Accept-Language"] || I18n.default_locale
    I18n.locale = locale.to_s.scan(/^[a-z]{2}/).first
  end

  def default_url_options
    {locale: I18n.locale}
  end
end
