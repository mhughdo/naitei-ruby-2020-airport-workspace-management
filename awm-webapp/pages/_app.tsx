import 'styles/antd.less'
import {ThemeProvider} from 'theme-ui'
import {theme} from 'styles/theme'
import App, {AppProps, AppContext} from 'next/app'
import Layout from 'components/Layout'
import {ConfigProvider} from 'antd'

import {Locale as AntdLocale} from 'antd/lib/locale-provider'
import enUS from 'antd/lib/locale/en_US'
import viVN from 'antd/lib/locale/vi_VN'
import {appWithTranslation, withTranslation, WithTranslation} from '../i18n'

const Layoutless: string[] = ['ForgotPassword', 'PasswordReset', 'Login']

function getAntdLocale(language: string): AntdLocale {
  switch (language) {
    case 'vi':
      return viVN
    default:
      return enUS
  }
}

function MyApp({Component, pageProps, i18n}: AppProps & WithTranslation): any {
  console.log(Component.name)

  return (
    <ThemeProvider theme={theme}>
      <ConfigProvider locale={getAntdLocale(i18n.language)}>
        {Layoutless.includes(Component.name) ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ConfigProvider>
    </ThemeProvider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)
  return {...appProps}
}

export default appWithTranslation(withTranslation([])(MyApp))
