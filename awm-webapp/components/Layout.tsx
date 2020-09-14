/* eslint-disable operator-linebreak */
/** @jsx jsx */
import {jsx, Image, Flex, Box, Text} from 'theme-ui'
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Badge,
  Button,
  Modal,
  Space,
  message,
  Upload,
} from 'antd'
import {
  CloudUploadOutlined,
  MenuUnfoldOutlined,
  GithubOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  DownOutlined,
  UpOutlined,
  BellOutlined,
  CalendarOutlined,
  ProjectOutlined,
  PlusOutlined,
  CopyOutlined,
  SettingOutlined,
  UserOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import React, {useState} from 'react'
import {WithTranslation, withTranslation, Link} from 'i18n'
import {useAuth} from '@providers/Auth'
import {setCookie} from 'nookies'
import axios from 'axios'
import authAxios from '@utils/axios'
import {queryCache, useMutation} from 'react-query'
import UKFLag from '../assets/svg/uk.svg'
import VNFLag from '../assets/svg/vietnam.svg'

const {Header, Sider, Content} = Layout
const {SubMenu} = Menu

const LayoutComponent: React.FunctionComponent<WithTranslation> = ({
  t,
  children,
  i18n,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
  const [language, setLanguage] = useState<string>(i18n.language)
  const {auth, logout} = useAuth()
  const uploadURL = 'https://examreg.hughdo.dev/api/upload_avatar'
  const [avatarModalVisible, setAvatarModalVisible] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [fileList, setFileList] = useState<Array<any>>([])

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const handleDropdownVisibleChange = (visible: boolean) => {
    setDropdownVisible(visible)
  }

  const changeLocale = () => {
    const newLanguage = language === 'vi' ? 'en' : 'vi'
    setLanguage(newLanguage)
    i18n.changeLanguage(newLanguage)
    setCookie(null, 'next-i18next', newLanguage, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      secure: true,
    })
  }
  const [changeAvatar] = useMutation(
    async ({avatarURL}: any) => {
      await authAxios({
        url: '/v1/profile/avatar',
        method: 'put',
        data: {
          avatarURL,
        },
      })
    },
    {
      onError: (err, _, rollback: () => any) => {
        message.error(t('error'))
      },
      onSuccess: () => {
        message.success(t('upload_success'))
      },
      onSettled: () => {
        queryCache.invalidateQueries('user_profile')
      },
    }
  )

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error(t('wrong_format'))
    }
    const isLt3M = file.size / 1024 / 1024 < 3
    if (!isLt3M) {
      message.error(t('wrong_size'))
    }
    return false
  }

  const getBase64 = (file, callback) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => callback(reader.result)
  }

  const handleChange = (info) => {
    let fileList = [...info.fileList]
    fileList = fileList.slice(-1)
    // console.log(fileList)
    getBase64(info.file, (url) => {
      setImageUrl(url)
    })
    setFileList(fileList)
  }

  const uploadFile = async (signedRequest, fileType) => {
    try {
      await axios.put(signedRequest, fileList[0].originFileObj, {
        headers: {
          'Content-Type': fileType,
        },
      })
    } catch (error) {
      message.error(t('error'))
      setConfirmLoading(false)
    }
  }

  const handleOk = async () => {
    try {
      if (fileList.length === 0) {
        message.error(t('no_file'))
        return
      }
      setConfirmLoading(true)
      const file = fileList[0]
      const {data} = await axios.get(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api/sign-s3'
          : '/api/sign-s3',
        {
          params: {
            'file-name': file.name,
            'file-type': file.type,
          },
        }
      )
      const {signedRequest, url: avatarURL} = data
      await uploadFile(signedRequest, file.type)
      await changeAvatar({avatarURL})
      setConfirmLoading(false)
      // message.success(t('upload_success'))
      setImageUrl(avatarURL)
    } catch (error) {
      setConfirmLoading(false)
      message.error(t('error'))
    }
    // // setAvatarModalVisible(false)
  }

  const DropdownMenuItem = (
    <Menu>
      <Menu.Item key='info'>
        <a href='#'>
          <Flex>
            <Avatar
              sx={{
                mr: 2,
                mt: 1,
              }}
              src={
                auth?.avatarURL ||
                'https://www.gravatar.com/avatar/86b862d65a8e66b9db99136cd16ff394?default=https%3A%2F%2Fcloud.digitalocean.com%2Favatars%2Fdefault1.png&amp;secure=true'
              }
            />
            <Box>
              <Text
                sx={{
                  fontSize: 2,
                }}>
                {auth?.name}
              </Text>
              {/* <Text
                sx={{
                  fontSize: 0,
                }}>
                {auth?.email}
              </Text> */}
              <Button
                type='link'
                onClick={() => setAvatarModalVisible(true)}
                sx={{
                  p: 0,
                  height: 'auto',
                }}>
                {t('change_avatar')}
              </Button>
              <Modal
                css={{
                  maxWidth: '720',
                  minWidth: '500px',
                }}
                title={t('change_avatar_desc')}
                visible={avatarModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={() => {
                  setFileList([])
                  setImageUrl('')
                  setAvatarModalVisible(false)
                }}>
                <Flex
                  sx={{
                    justifyContent: 'space-between',
                  }}>
                  <Space
                    direction='vertical'
                    sx={{
                      justifyContent: 'center',
                      maxWidth: '50%',
                    }}>
                    <Upload
                      name='avatar'
                      action={uploadURL}
                      accept='.png, .jpg, .jpeg'
                      multiple={false}
                      fileList={fileList}
                      onChange={handleChange}
                      beforeUpload={beforeUpload}
                      withCredentials>
                      <Button type='text' icon={<CloudUploadOutlined />}>
                        Change avatar
                      </Button>
                    </Upload>

                    <Button type='text' icon={<DeleteOutlined />}>
                      Remove avatar
                    </Button>
                  </Space>
                  <Box>
                    <Avatar
                      size={128}
                      src={
                        imageUrl ||
                        auth?.avatarURL ||
                        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
                      }
                    />
                  </Box>
                </Flex>
              </Modal>
            </Box>
          </Flex>
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='my_profile'>
        <Link
          href={{
            pathname: '/users/[id]/profile',
            query: {
              id: auth?.id,
            },
          }}
          as={`/users/${auth?.id}/profile`}>
          <a>{t('my_profile')}</a>
        </Link>
      </Menu.Item>
      <Menu.Item key='settings'>
        <Link
          href={{
            pathname: '/users/[id]/settings',
            query: {
              id: auth?.id,
            },
          }}
          as={`/users/${auth?.id}/settings`}>
          <a>{t('settings')}</a>
        </Link>
      </Menu.Item>
      <Menu.Item key='sign_out'>
        <Button
          type='link'
          onClick={() => logout()}
          sx={{
            p: 0,
            color: 'rgba(0, 0, 0, 0.65)',
            height: 'auto',
            ':hover': {
              color: 'rgba(0, 0, 0, 0.65)',
            },
          }}>
          {t('sign_out')}
        </Button>
      </Menu.Item>
    </Menu>
  )
  return (
    <Layout
      hasSider
      sx={{
        minHeight: '100vh',
      }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Box
          sx={{
            margin: '16px',
          }}>
          <Link href='/'>
            <a>
              <Image src='/logo.png' />
            </a>
          </Link>
        </Box>
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['working_calendar']}>
          <Menu.Item key='working_calendar' icon={<CalendarOutlined />}>
            <Link href='/' as='/'>
              <a>{t('working_calendar')}</a>
            </Link>
          </Menu.Item>
          <Menu.Item key='stats' icon={<ProjectOutlined />}>
            <Link href='/statistics' as='/statistics'>
              <a>{t('stats')}</a>
            </Link>
          </Menu.Item>
          <SubMenu key='requestMenu' icon={<CopyOutlined />} title={t('req')}>
            <Menu.Item key='new' icon={<PlusOutlined />}>
              <Link href='/request/new' as='/request/new'>
                <a>{t('new_req')}</a>
              </Link>
            </Menu.Item>
            <Menu.Item key='my_req' icon={<GithubOutlined />}>
              <Link href='/request' as='/request'>
                <a>{t('my_req')}</a>
              </Link>
            </Menu.Item>
            {auth?.position_name === 'Manager' && (
              <Menu.Item key='all' icon={<DatabaseOutlined />}>
                <Link href='/request/all' as='/request/all'>
                  <a>{t('all_req')}</a>
                </Link>
              </Menu.Item>
            )}
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header
          sx={{
            bg: 'white',
            px: 4,
            boxShadow: 'sm',
          }}>
          <Flex
            sx={{
              justifyContent: 'space-between',
            }}>
            {collapsed ? (
              <MenuUnfoldOutlined
                sx={{
                  variant: 'buttons.menuTrigger',
                }}
                onClick={toggle}
              />
            ) : (
              <MenuFoldOutlined
                sx={{
                  variant: 'buttons.menuTrigger',
                }}
                onClick={toggle}
              />
            )}
            <Flex
              sx={{
                alignItems: 'center',
              }}>
              <Box>
                <Badge count={5}>
                  <BellOutlined
                    sx={{
                      fontSize: 5,
                      verticalAlign: 'middle',
                    }}
                  />
                </Badge>
              </Box>
              <Box
                sx={{
                  ml: 5,
                }}>
                <SettingOutlined
                  sx={{
                    fontSize: 5,
                    verticalAlign: 'middle',
                  }}
                />
              </Box>
              <Box
                sx={{
                  ml: 5,
                }}>
                {language === 'vi' ? (
                  <Button
                    type='link'
                    onClick={changeLocale}
                    sx={{
                      p: 0,
                    }}>
                    <VNFLag
                      sx={{
                        variant: 'icons.countryFlag',
                      }}
                    />
                  </Button>
                ) : (
                  <Button
                    type='link'
                    onClick={changeLocale}
                    sx={{
                      p: 0,
                    }}>
                    <UKFLag
                      sx={{
                        variant: 'icons.countryFlag',
                      }}
                    />
                  </Button>
                )}
              </Box>
              <Dropdown
                arrow
                overlay={DropdownMenuItem}
                trigger={['click']}
                onVisibleChange={handleDropdownVisibleChange}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Box
                  sx={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    ml: 5,
                  }}>
                  <Avatar
                    src={
                      auth?.avatarURL ||
                      'https://www.gravatar.com/avatar/86b862d65a8e66b9db99136cd16ff394?default=https%3A%2F%2Fcloud.digitalocean.com%2Favatars%2Fdefault1.png&amp;secure=true'
                    }
                    size='large'
                  />
                  {dropdownVisible ? (
                    <UpOutlined
                      sx={{
                        fontSize: '12px',
                        marginLeft: '8px',
                        fontWeight: 'bold',
                        verticalAlign: 'middle',
                      }}
                    />
                  ) : (
                    <DownOutlined
                      sx={{
                        fontSize: '12px',
                        marginLeft: '8px',
                        fontWeight: 'bold',
                        verticalAlign: 'middle',
                      }}
                    />
                  )}
                </Box>
              </Dropdown>
            </Flex>
          </Flex>
        </Header>
        <Content
          sx={{
            mt: 5,
            mx: 4,
            p: 5,
          }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default withTranslation('layout')(LayoutComponent)
