/** @jsx jsx */
import {jsx, Box, Container, Text} from 'theme-ui'
import {Card, Descriptions, Avatar, Button, Result} from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  ContactsOutlined,
  GroupOutlined,
  MailOutlined,
} from '@ant-design/icons'
import {FaBirthdayCake, FaTransgender, FaAddressBook} from 'react-icons/fa'
import {Link, WithTranslation, withTranslation} from 'i18n'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {formatDate} from 'utils/date'
import {NextPage} from 'next'
import {parseCookies} from 'nookies'
import axios from 'utils/axios'
import {useAuth, User} from '@providers/Auth'

const UserProfile: NextPage<WithTranslation & {auth: User}> = ({t, auth}) => {
  const [userInfo, setUserInfo] = useState<User>(auth)
  const {auth: userData} = useAuth()
  const router = useRouter()

  return (
    <Container>
      <Box
        sx={{
          px: 4,
          maxWidth: '100%',
        }}>
        <Card>
          {userInfo ? (
            <>
              <Box
                sx={{
                  mb: 5,
                  textAlign: 'center',
                }}>
                <Avatar
                  size={100}
                  sx={{
                    mb: 5,
                  }}
                  src='https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
                />
                <Text
                  sx={{
                    fontSize: 4,
                    fontWeight: 'medium',
                  }}>
                  {userInfo?.name}
                </Text>
              </Box>
              <Box>
                <Descriptions
                  title={t('user_info')}
                  bordered
                  layout='vertical'
                  extra={
                    userData.unit_name === 'BA' && (
                      <Button type='link'>
                        <Link
                          href={`/users/${userInfo.id}/settings`}
                          as={`/users/${userInfo.id}/settings`}>
                          <a>{t('edit')}</a>
                        </Link>
                      </Button>
                    )
                  }>
                  <Descriptions.Item
                    label={
                      <span>
                        <UserOutlined /> {t('name')}
                      </span>
                    }>
                    {userInfo?.name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <MailOutlined /> {t('email')}
                      </span>
                    }>
                    {userInfo?.email}
                  </Descriptions.Item>
                  {userInfo?.phone && (
                    <Descriptions.Item
                      label={
                        <span>
                          <PhoneOutlined /> {t('phone')}
                        </span>
                      }>
                      {userInfo?.phone}
                    </Descriptions.Item>
                  )}

                  <Descriptions.Item
                    label={
                      <span>
                        <FaTransgender /> {t('gender')}
                      </span>
                    }>
                    {userInfo?.gender_name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <FaBirthdayCake /> {t('birthday')}
                      </span>
                    }>
                    {formatDate(
                      Number(userInfo?.birthday) || new Date().getTime()
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <ContactsOutlined /> {t('pos')}
                      </span>
                    }>
                    {userInfo?.position_name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <GroupOutlined /> {t('unit')}
                      </span>
                    }>
                    {userInfo?.unit_name}
                  </Descriptions.Item>
                  {userInfo?.address && (
                    <Descriptions.Item
                      label={
                        <span>
                          <FaAddressBook /> {t('address')}
                        </span>
                      }>
                      {userInfo?.address}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Box>
            </>
          ) : (
            <Result
              status='404'
              title='404'
              subTitle={t('not_found')}
              extra={
                <Button type='primary' onClick={() => router.push('/')}>
                  {t('back_home')}
                </Button>
              }
            />
          )}
        </Card>
      </Box>
    </Container>
  )
}

UserProfile.getInitialProps = async (pageContext): Promise<any> => {
  try {
    const cookies = parseCookies(pageContext)
    let auth = JSON.parse(cookies.auth) as User
    if (auth?.id !== Number(pageContext.query?.id)) {
      const {data} = await axios({
        url: `/v1/users/${pageContext.query?.id}`,
        method: 'get',
        headers: {
          Authorization: `${cookies.token}`,
        },
      })
      auth = data
    }
    return {auth, namespacesRequired: ['profile', 'common']}
  } catch (error) {
    console.log(error.response)
    return {auth: null}
  }
}

export default withTranslation(['profile', 'common'])(UserProfile)
