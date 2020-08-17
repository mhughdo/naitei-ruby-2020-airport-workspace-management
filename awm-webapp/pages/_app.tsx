import 'styles/antd.less'
import {ThemeProvider} from 'theme-ui'
import {theme} from 'styles/theme'
import type {AppProps} from 'next/app'
import Layout from '@components/Layout'

function MyApp({Component, pageProps}: AppProps): React.ReactNode {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default MyApp
