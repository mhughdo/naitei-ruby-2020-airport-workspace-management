/** @jsx jsx */
import {jsx, Box, Text, Container} from 'theme-ui'
import {Form, Input, Button, Result, message} from 'antd'
import {WithTranslation, withTranslation, Router} from 'i18n'
import {useState} from 'react'
import axios from 'utils/axios'
import ForgotPasswordBackground from '../assets/forgot_password_background.jpg'
import Plane from '../assets/svg/plane.svg'

const RequestResetPassword: React.FC<WithTranslation> = ({t}) => {
  const [isEmailSentSuccessful, setIsEmailSentSuccessful] = useState<boolean>(
    false
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      const {email} = values
      if (email) {
        setIsLoading(true)
        const {data} = await axios({
          url: 'v1/auth/password/reset',
          method: 'post',
          data: {
            email,
          },
        })
        setIsLoading(false)
        if (data?.message) {
          message.success(data?.message)
          Router.push('/forgot_password?success=true', undefined, {
            shallow: true,
          })
          setIsEmailSentSuccessful(true)
        }
      }
    } catch (error) {
      setIsLoading(false)
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
          {isEmailSentSuccessful ? (
            <Result
              status='success'
              title={t('email_sent_successfully_title')}
              subTitle={t('email_sent_successfully_desc')}
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
                }}>
                {t('forgot_password')}
              </Text>
              <Text
                sx={{
                  my: 4,
                }}>
                {t('desc')}
              </Text>
              <Form layout='vertical' form={form} onFinish={onFinish}>
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
                  <Input size='large' type='email' />
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
                    {t('request_password_reset')}
                  </Button>
                </Form.Item>
              </Form>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default withTranslation('reset_password')(RequestResetPassword)
