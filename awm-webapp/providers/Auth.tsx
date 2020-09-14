/* eslint-disable operator-linebreak */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-empty-function */
import useUserProfile from 'hooks/useUserProfile'
import {Router} from 'i18n'
import {useRouter} from 'next/router'
import {destroyCookie, setCookie} from 'nookies'
import {
  ReactNode,
  ReactElement,
  useState,
  Dispatch,
  createContext,
  useContext,
} from 'react'

export type User = {
  id: number
  email: string
  name: string
  address: string | null
  gender_name: string
  position_name: string
  unit_name: string
  user_status_name: string
  birthday: string
  phone: string
  avatarURL: string
} | null

type AuthContext = {
  isAuthenticated: boolean
  auth: User | null
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  setAuth: Dispatch<React.SetStateAction<User>>
  logout: any
}

const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  auth: null,
  setAuthenticated: () => {},
  setAuth: () => {},
  logout: () => {},
})

export const AuthProvider = ({
  children,
  authenticated,
  preLoadAuth,
}: {
  children: ReactNode
  authenticated: boolean
  preLoadAuth: User
}): ReactElement => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(authenticated)
  const [auth, setAuth] = useState<User>(preLoadAuth)
  const {isLoading, data} = useUserProfile(isAuthenticated)
  const router = useRouter()

  const logout = () => {
    destroyCookie(null, 'token')
    destroyCookie(null, 'auth')
    // setAuth(null)
    // setAuthenticated(false)
    window.location.href = '/login'
  }

  if (authenticated && !isLoading) {
    const userData = data?.data
    if (
      userData &&
      auth?.id &&
      auth !== userData &&
      Object.entries(auth).sort().toString() !==
        Object.entries(userData).sort().toString()
    ) {
      // console.log('auth', auth, 'userData', userData)
      // destroyCookie(null, 'token')
      // destroyCookie(null, 'auth')
      setCookie(null, 'auth', JSON.stringify(userData), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      setAuth(userData)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        // eslint-disable-next-line prettier/prettier
        setAuthenticated: (authenticated: boolean) => setAuthenticated(authenticated),
        auth,
        setAuth: (auth: User) => setAuth(auth),
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useIsAuthenticated(): boolean {
  const context = useAuth()
  return context.isAuthenticated
}
