/** @jsx jsx */
import {jsx, Box, Heading, Flex} from 'theme-ui'
import {Form, Input, Button, Checkbox, message} from 'antd'
import PropTypes from 'prop-types'
import {NextPage} from 'next'
import {useAuth} from 'providers/Auth'
import axios from 'utils/axios'
import {setCookie} from 'nookies'
import {useState} from 'react'
import {Link, Router, withTranslation, WithTranslation} from '../i18n'
import ForgotPasswordBackground from '../assets/forgot_password_background.jpg'
import Plane from '../assets/svg/plane.svg'

const LoginComponent: NextPage<WithTranslation> = ({t}) => {
  const [form] = Form.useForm()
  const {setAuth, setAuthenticated} = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onFinish = async (values) => {
    const {email, password} = values
    try {
      setIsLoading(true)
      const {data} = await axios({
        url: '/v1/auth/login',
        method: 'post',
        data: {
          email,
          password,
        },
      })
      setIsLoading(false)
      if (data) {
        const {user, token} = data?.data
        // document.cookie = `token=${token}`
        setCookie(null, 'token', token, {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })
        setCookie(null, 'auth', JSON.stringify(user), {
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        })
        setAuthenticated(true)
        setAuth(user)
        Router.push('/')
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      if (error?.response?.data.error) {
        message.error(error.response.data.error)
      }
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Box
      sx={{
        height: '100vh',
        bg: (theme) => theme.colors.gray[1],
      }}>
      <Box
        sx={{
          backgroundImage: `url(${ForgotPasswordBackground})`,
          backgroundPosition: 'center center',
          position: 'fixed',
          backgroundSize: 'cover',
          zIndex: 1,
          width: '100vw',
          height: '100vh',
          bg: 'white',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
        }}>
        <Box
          sx={{
            mx: 'auto',
            width: '400px',
            pt: 8,
            px: 4,
          }}>
          <Box
            sx={{
              p: 4,
              mt: 4,
              border: '1px solid #d8dee2',
              bg: 'white',
            }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}>
              <Plane
                sx={{
                  width: '48px',
                  height: '48px',
                }}
              />
            </Box>
            <Box
              sx={{
                mb: 4,
                textAlign: 'center',
              }}>
              <Heading
                sx={{
                  fontSize: 5,
                  fontWeight: 'light',
                }}>
                {t('title')}
              </Heading>
            </Box>
            <Form
              name='basic'
              initialValues={{remember: true}}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout='vertical'
              form={form}>
              <Form.Item
                label={t('email')}
                name='email'
                rules={[
                  {
                    required: true,
                    message: t('required_input', {
                      inputName: t('email').toLowerCase(),
                    }),
                  },
                ]}>
                <Input type='email' />
              </Form.Item>
              <Form.Item
                label={t('password')}
                name='password'
                rules={[
                  {
                    required: true,
                    message: t('required_input', {
                      inputName: t('password').toLowerCase(),
                    }),
                  },
                ]}>
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Flex
                  sx={{
                    justifyContent: 'space-between',
                  }}>
                  <Form.Item name='remember' valuePropName='checked' noStyle>
                    <Checkbox>{t('remember_me')}</Checkbox>
                  </Form.Item>

                  <Link href='/forgot_password' as='/forgot_password'>
                    <a>{t('forgot_password')}</a>
                  </Link>
                </Flex>
              </Form.Item>
              <Form.Item>
                <Button
                  sx={{
                    width: '100%',
                  }}
                  type='primary'
                  loading={isLoading}
                  htmlType='submit'>
                  {t('login')}
                </Button>
              </Form.Item>
            </Form>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

LoginComponent.getInitialProps = async (): Promise<any> => ({
  namespacesRequired: ['common', 'login'],
})

LoginComponent.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withTranslation('login')(LoginComponent)
