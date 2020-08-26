/* eslint-disable operator-linebreak */
import {useRouter} from 'next/router'
import {AppContext} from 'next/app'
import {destroyCookie, parseCookies, setCookie} from 'nookies'
import {WithTranslation} from 'next-i18next'

function isBrowser() {
  return typeof window !== 'undefined'
}

const nonAuthPaths = ['/forgot_password', '/login', '/password_resets/[token]']
const loginPath = nonAuthPaths[1]

type NextApp<P = Record<string, unknown>, IP = P> = {
  getInitialProps?(context: AppContext): Promise<any>
} & React.FC<P>

export default function withAuth<P = Record<string, unknown>, IP = P>(
  WrappedComponent: NextApp<WithTranslation, IP>
): NextApp<unknown, IP> {
  const WithAuthWrapper: NextApp<
    WithTranslation & {
      authenticated: boolean
    }
  > = (props) => {
    const router = useRouter()
    const {authenticated, i18n} = props

    const conditionalRedirect = () => {
      if (!authenticated && !nonAuthPaths.includes(router.pathname)) {
        router.push(loginPath)
        return <></>
      }

      if (authenticated && nonAuthPaths.includes(router.pathname)) {
        router.push('/')
        return <></>
      }
    }

    const setLocaleCookie = () => {
      const cookies = parseCookies()
      if (!cookies['next-i18next']) {
        setCookie(null, 'next-i18next', i18n.language, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
          secure: true,
        })
      }
    }

    if (isBrowser()) {
      conditionalRedirect()
      setLocaleCookie()
    }
    return <WrappedComponent {...props} />
  }

  WithAuthWrapper.getInitialProps = async (appContext: AppContext) => {
    let authenticated = false
    let auth = null
    const {ctx} = appContext
    const {res, pathname} = ctx
    const cookies = parseCookies(appContext.ctx)

    if (!isBrowser() && res) {
      if (!cookies?.token && !nonAuthPaths.includes(pathname)) {
        res.writeHead(302, {Location: loginPath})
        res.end()
      }
    }

    if (cookies.token) {
      authenticated = true
    }

    try {
      if (cookies?.auth) {
        auth = JSON.parse(cookies.auth)
      }
    } catch (error) {
      destroyCookie(appContext.ctx, 'token')
      destroyCookie(appContext.ctx, 'auth')
      authenticated = false
      auth = null
    }

    const componentProps = await WrappedComponent.getInitialProps(appContext)

    return {...componentProps, authenticated, auth}
  }

  return WithAuthWrapper
}
