/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/** @jsx jsx */
import {
  Avatar,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Upload,
  Result,
  message,
} from 'antd'
import {Router, withTranslation, WithTranslation} from 'i18n'
import {UploadOutlined} from '@ant-design/icons'
import {NextPage} from 'next'
import {jsx, Box, Flex, Text} from 'theme-ui'
import {parseCookies} from 'nookies'
import {useAuth, User} from '@providers/Auth'
import axios from 'utils/axios'
import {useEffect} from 'react'
import moment from 'moment'
import {queryCache, useMutation} from 'react-query'

const {Option} = Select

const {TabPane} = Tabs

const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
}

interface SelectOptions {
  genders: [
    {
      id: number
      name: string
    }
  ]
  positions: [
    {
      id: number
      name: string
    }
  ]
  units: [
    {
      id: number
      name: string
    }
  ]
  shifts: [
    {
      id: number
      name: string
      time_start: string
      time_end: string
    }
  ]
}

const ProfileSettings: NextPage<
  WithTranslation & {userInfo: Partial<User>; selectOptions: SelectOptions}
> = ({t, userInfo, selectOptions}) => {
  const [form] = Form.useForm()
  const {auth} = useAuth()
  const [updateProfile, {isLoading, isSuccess, isError, error}] = useMutation(
    async ({params, url}: any) => {
      await axios({
        url,
        method: 'put',
        data: params,
      })
    },
    {
      onMutate: (data) => {
        queryCache.cancelQueries('user_profile')

        const prevData = queryCache.getQueryData('user_profile')
        queryCache.setQueryData('user_profile', (old: User) => ({
          ...old,
          ...data.fieldsValue,
        }))

        // Return the snapshotted value
        return () => queryCache.setQueryData('user_profile', prevData)
      },
      onError: (err, newTodo, rollback: () => any) => {
        message.error(t('error'))
        rollback()
      },
      onSuccess: () => {
        message.success(t('update_sucess'))
      },
      onSettled: () => {
        queryCache.invalidateQueries('user_profile')
      },
    }
  )

  const {
    id,
    name,
    email,
    address,
    gender_name,
    position_name,
    unit_name,
    birthday,
    phone,
  } = userInfo || {}

  const {genders, positions, units} = selectOptions || {}

  const isDisabled = (): boolean => {
    if (auth.unit_name !== 'BA') return true
    if (auth.position_name === 'Manager' && position_name === 'Admin') {
      return true
    }

    return false
  }

  useEffect(() => {
    form.setFieldsValue({
      name,
      email,
      address,
      gender: gender_name,
      phone,
      position: position_name,
      unit: unit_name,
      birthday: moment(Number(birthday)),
    })
  }, [])

  const onFinish = async (fieldsValue) => {
    const values = {
      ...fieldsValue,
      birthday: new Date(fieldsValue.birthday).getTime(),
    }

    const {
      name,
      birthday,
      email,
      gender,
      address,
      phone,
      position,
      unit,
    } = values
    const params = {
      name,
      birthday,
      address,
      email,
      phone,
      gender_id: genders.find((g) => g.name === gender).id,
      position_id: positions.find((pos) => pos.name === position).id,
      unit_id: units.find((u) => u.name === unit).id,
    }

    try {
      await updateProfile({
        params,
        url: `/v1/users/${id}/update`,
        fieldsValue: values,
      })
    } catch (error) {
      const errMessage = error?.response?.data?.error || t('error')
      message.error(errMessage)
    }
    console.log('Received values of form: ', values)
  }

  return (
    <Box
      sx={{
        bg: 'white',
        height: '100%',
      }}>
      <Flex
        sx={{
          py: 4,
        }}>
        <Box>
          <Tabs tabPosition='left' size='middle'>
            <TabPane tab={t('basic_settings')} key='basic'>
              {userInfo ? (
                auth.unit_name !== 'BA' ? (
                  <Box
                    sx={{
                      width: '60vw',
                      display: 'flex',
                      justifyContent: 'center',
                    }}>
                    <Result
                      status='403'
                      title='403'
                      subTitle={t('unauthorized')}
                      extra={
                        <Button type='primary' onClick={() => Router.push('/')}>
                          {t('back_home')}
                        </Button>
                      }
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      pl: 5,
                    }}>
                    <Text
                      sx={{
                        fontSize: 4,
                        fontWeight: 'semibold',
                        mb: 4,
                      }}>
                      {t('account_settings')}
                    </Text>
                    <Flex>
                      <Box
                        sx={{
                          minWidth: '350px',
                          maxWidth: '700xpx',
                        }}>
                        <Form
                          // {...formItemLayout}
                          form={form}
                          name='register'
                          layout='vertical'
                          onFinish={onFinish}
                          initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                          }}
                          scrollToFirstError>
                          <Form.Item
                            name='name'
                            label={t('name')}
                            rules={[
                              {
                                required: true,
                                message: t('please_input', {
                                  inputName: t('name').toLowerCase(),
                                }),
                              },
                            ]}>
                            <Input disabled={isDisabled()} />
                          </Form.Item>
                          <Form.Item
                            name='email'
                            label='E-mail'
                            rules={[
                              {
                                type: 'email',
                                message: t('invalid_email'),
                              },
                              {
                                required: true,
                                message: t('please_input', {
                                  inputName: t('email').toLowerCase(),
                                }),
                              },
                            ]}
                            hasFeedback>
                            <Input disabled={isDisabled()} />
                          </Form.Item>
                          <Form.Item
                            name='address'
                            label={t('address')}
                            rules={[
                              {
                                required: true,
                                message: t('please_input', {
                                  inputName: t('address').toLowerCase(),
                                }),
                              },
                            ]}>
                            <Input disabled={isDisabled()} />
                          </Form.Item>
                          <Form.Item name='gender' label={t('gender')}>
                            <Select
                              disabled={isDisabled()}
                              placeholder={t('please_select', {
                                selectName: t('gender').toLowerCase(),
                              })}>
                              {genders.map((gender) => {
                                return (
                                  <Option key={gender.name} value={gender.id}>
                                    {gender.name}
                                  </Option>
                                )
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item name='birthday' label={t('birthday')}>
                            <DatePicker
                              disabled={isDisabled()}
                              sx={{
                                width: '100%',
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            name='phone'
                            label={t('phone')}
                            rules={[
                              {
                                required: true,
                                message: t('please_input', {
                                  inputName: t('phone').toLowerCase(),
                                }),
                              },
                              {
                                pattern: /[0-9]{10,11}/g,
                                message: t('invalid_phone'),
                              },
                            ]}>
                            <Input
                              disabled={isDisabled()}
                              style={{
                                width: '100%',
                              }}
                            />
                          </Form.Item>
                          <Form.Item name='position' label={t('pos')}>
                            <Select
                              disabled={isDisabled()}
                              placeholder={t('please_select', {
                                selectName: t('pos').toLowerCase(),
                              })}>
                              {positions.map((pos) => {
                                if (
                                  // eslint-disable-next-line operator-linebreak
                                  pos.name === 'Admin' &&
                                  auth.position_name === 'Manager'
                                ) {
                                  return null
                                }

                                return (
                                  <Option key={pos.name} value={pos.id}>
                                    {pos.name}
                                  </Option>
                                )
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item name='unit' label={t('unit')}>
                            <Select
                              disabled={isDisabled()}
                              placeholder={t('please_select', {
                                selectName: t('unit').toLowerCase(),
                              })}>
                              {units.map((unit) => {
                                return (
                                  <Option key={unit.name} value={unit.id}>
                                    {unit.name}
                                  </Option>
                                )
                              })}
                            </Select>
                          </Form.Item>

                          <Form.Item>
                            <Button
                              disabled={isDisabled()}
                              loading={isLoading}
                              type='primary'
                              htmlType='submit'>
                              {t('update_info')}
                            </Button>
                          </Form.Item>
                        </Form>
                      </Box>
                      <Box
                        sx={{
                          pl: 8,
                        }}>
                        {t('avatar')}
                        <Box
                          sx={{
                            mt: 4,
                          }}>
                          <Avatar
                            size={150}
                            src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
                          />
                        </Box>
                        <Box
                          sx={{
                            mt: 4,
                          }}>
                          <Upload {...props}>
                            <Button disabled={isDisabled()}>
                              <UploadOutlined /> {t('change_avatar')}
                            </Button>
                          </Upload>
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                )
              ) : (
                <Box
                  sx={{
                    width: '60vw',
                    display: 'flex',
                    justifyContent: 'center',
                  }}>
                  <Result
                    status='404'
                    title='404'
                    subTitle={t('not_found')}
                    extra={
                      <Button type='primary' onClick={() => Router.push('/')}>
                        {t('back_home')}
                      </Button>
                    }
                  />
                </Box>
              )}
            </TabPane>
            <TabPane tab={t('notification')} key='notification'>
              Notification
            </TabPane>
            <TabPane tab={t('workspace_settings')} key='workspace'>
              Workspace settings
            </TabPane>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  )
}

ProfileSettings.getInitialProps = async (pageContext): Promise<any> => {
  try {
    const cookies = parseCookies(pageContext)
    console.log('Profile Settings', cookies)
    let userInfo = JSON.parse(cookies.auth) as User
    const selectOptions = {} as SelectOptions
    if (userInfo?.id !== Number(pageContext.query?.id)) {
      const {data} = await axios({
        url: `/v1/users/${pageContext.query?.id}`,
        method: 'get',
        headers: {
          Authorization: `${cookies.token}`,
        },
      })
      userInfo = data
    }

    const promises = []
    const types = ['gender', 'position', 'unit']

    types.forEach((type) => {
      promises.push(
        axios({
          url: `/v1/${type}/types`,
          headers: {
            Authorization: `${cookies.token}`,
          },
          method: 'get',
        })
      )
    })

    const [genders, positions, units] = await Promise.all(promises)
    selectOptions.genders = genders.data
    selectOptions.positions = positions.data
    selectOptions.units = units.data
    return {userInfo, selectOptions, namespacesRequired: ['profile', 'common']}
  } catch (error) {
    console.log(error.message)
    return {userInfo: null}
  }
}

export default withTranslation(['profile', 'common'])(ProfileSettings)
