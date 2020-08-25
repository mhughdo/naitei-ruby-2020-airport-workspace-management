/* eslint-disable no-nested-ternary */
/** @jsx jsx */
import {jsx, Box, Text, Container} from 'theme-ui'
import {Form, Input, Button, Result, message} from 'antd'
import {WithTranslation, withTranslation, Router} from 'i18n'
import {useState} from 'react'
import axios from 'utils/axios'
import ForgotPasswordBackground from '../assets/forgot_password_background.jpg'
import Plane from '../assets/svg/plane.svg'

const ResetPassword: React.FC<WithTranslation & {isValidToken: boolean}> = ({
  t,
  isValidToken,
}) => {
  const [isPasswordResetSuccessful, setIsPasswordResetSuccessful] = useState<
    boolean
  >(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      const {password, confirm_password} = values
      const {email, token} = Router.query

      if (password !== confirm_password) {
        message.error(t('password_must_match'))
      } else {
        setIsLoading(true)
        const {data} = await axios({
          url: '/v1/auth/password/update',
          method: 'put',
          data: {
            email,
            token,
            password,
            password_confirmation: confirm_password,
          },
        })
        if (data?.message) {
          setIsLoading(false)
          setIsPasswordResetSuccessful(true)
        }
      }
    } catch (error) {
      setIsLoading(false)
      console.log('error')
      if (error?.response?.data?.error) {
        message.error(error?.response?.data?.error)
      }
    }
  }

  return (
    <Box>
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
      <Container
        sx={{
          pt: 8,
          display: 'flex',
          justifyContent: 'space-around',
        }}>
        <Box
          sx={{
            width: '480px',
            position: 'relative',
            zIndex: 1,
            height: '100%',
            borderRadius: '3px',
            boxShadow: 'sm',
            py: 5,
            bg: 'white',
            border: '1px solid rgba(91, 105, 135, 0.22)',
            mt: '10vh',
            overflow: 'auto',
          }}>
          {isValidToken ? (
            isPasswordResetSuccessful ? (
              <Result
                status='success'
                title={t('password_reset_successfully')}
                extra={
                  <Button type='link' onClick={() => Router.push('/login')}>
                    {t('back_to_login')}
                  </Button>
                }
              />
            ) : (
              <Box
                sx={{
                  px: 5,
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                  }}>
                  <Plane />
                </Box>
                <Text
                  sx={{
                    mb: 4,
                    lineHeight: 'body',
                    fontWeight: 'semibold',
                    fontSize: 5,
                  }}>
                  {t('reset_password')}
                </Text>
                <Form layout='vertical' form={form} onFinish={onFinish}>
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
                    <Input size='large' type='password' />
                  </Form.Item>
                  <Form.Item
                    label={t('confirm_password')}
                    name='confirm_password'
                    rules={[
                      {
                        required: true,
                        message: t('required_input', {
                          inputName: t('password').toLowerCase(),
                        }),
                      },
                    ]}>
                    <Input size='large' type='password' />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      size='large'
                      loading={isLoading}
                      sx={{
                        width: '100%',
                      }}
                      type='primary'
                      htmlType='submit'>
                      {t('reset_password')}
                    </Button>
                  </Form.Item>
                </Form>
              </Box>
            )
          ) : (
            <Result
              status='error'
              title={t('invalid_token')}
              extra={
                <Button
                  type='link'
                  onClick={() => Router.push('/forgot_password')}>
                  {t('reset_password')}
                </Button>
              }
            />
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default withTranslation('reset_password')(ResetPassword)
