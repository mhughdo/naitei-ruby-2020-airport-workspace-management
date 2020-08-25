import 'styles/antd.less'
import {ThemeProvider} from 'theme-ui'
import {theme} from 'styles/theme'
import App, {AppContext, AppProps} from 'next/app'
import Layout from 'components/Layout'
import {ConfigProvider} from 'antd'
import {Locale as AntdLocale} from 'antd/lib/locale-provider'
import enUS from 'antd/lib/locale/en_US'
import viVN from 'antd/lib/locale/vi_VN'
import {ReactQueryDevtools} from 'react-query-devtools'
import {AuthProvider, User} from 'providers/Auth'
import withAuth from 'hocs/withAuth'
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

function MyApp({
  Component,
  pageProps,
  i18n,
  authenticated,
  auth,
}: AppProps & WithTranslation & {authenticated: boolean; auth: User}): any {
  const componentName = Component.displayName || Component.name

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider authenticated={authenticated} preLoadAuth={auth}>
        <ConfigProvider locale={getAntdLocale(i18n.language)}>
          {Layoutless.includes(String(componentName)) ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </ConfigProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </AuthProvider>
    </ThemeProvider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)
  return {...appProps}
}

export default appWithTranslation(withTranslation([])(withAuth(MyApp)))
