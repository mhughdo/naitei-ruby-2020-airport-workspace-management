/* eslint-disable operator-linebreak */
import {useRouter} from 'next/router'
import {AppContext} from 'next/app'
import {parseCookies} from 'nookies'

function isBrowser() {
  return typeof window !== 'undefined'
}

const nonAuthPaths = ['/forgot_password', '/login', '/password_resets/[token]']
const loginPath = nonAuthPaths[1]

export default function withAuth(WrappedComponent) {
  const WithAuthWrapper = (props) => {
    const router = useRouter()
    const {authenticated} = props

    console.log(authenticated, router.pathname)

    if (isBrowser()) {
      if (!authenticated && !nonAuthPaths.includes(router.pathname)) {
        router.push(loginPath)
        return <></>
      }

      if (authenticated && nonAuthPaths.includes(router.pathname)) {
        router.push('/')
        return <></>
      }
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

    if (cookies?.auth) {
      auth = JSON.parse(cookies.auth)
    }
    const componentProps = await WrappedComponent.getInitialProps(appContext)

    return {...componentProps, authenticated, auth}
  }

  return WithAuthWrapper
}
