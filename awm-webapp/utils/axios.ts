import {destroyCookie, parseCookies} from 'nookies'
import axios from 'axios'
import Router from 'next/router'

const instance = axios.create({
  baseURL: 'https://awm.hughdo.dev/api',
})

instance.interceptors.request.use(
  (config) => {
    const cookies = parseCookies()
    if (cookies?.token) {
      config.headers.Authorization = `${cookies.token}`
    }

    if (cookies['next-i18next']) {
      config.headers['accept-language'] = cookies['next-i18next']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const code = error && error.response ? error.response.status : 0
    if (code === 401) {
      if (typeof window !== 'undefined') {
        Router.push('/login')
        destroyCookie(null, 'token')
        destroyCookie(null, 'auth')
        console.log('Logged out')
      }
    }
    return Promise.reject(error)
  }
)

export default instance
