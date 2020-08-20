/** @jsx jsx */
import {jsx, Box, Container, Text} from 'theme-ui'
import {Card, Descriptions, Avatar, Button} from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  ContactsOutlined,
  GroupOutlined,
} from '@ant-design/icons'
import {FaBirthdayCake, FaTransgender} from 'react-icons/fa'
import {WithTranslation, withTranslation} from 'i18n'

const UserProfile: React.FC<WithTranslation> = ({t}) => {
  return (
    <Container>
      <Box
        sx={{
          px: 4,
          maxWidth: '100%',
        }}>
        <Card>
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
              Hugh Do
            </Text>
          </Box>
          <Box>
            <Descriptions
              title={t('user_info')}
              bordered
              layout='vertical'
              extra={<Button type='link'>{t('edit')}</Button>}>
              <Descriptions.Item
                label={
                  <span>
                    <UserOutlined /> {t('name')}
                  </span>
                }>
                Do Manh Hung
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <PhoneOutlined /> {t('phone')}
                  </span>
                }>
                0912345678
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <FaTransgender /> {t('gender')}
                  </span>
                }>
                Male
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <FaBirthdayCake /> {t('birthday')}
                  </span>
                }>
                12/11/1999
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <ContactsOutlined /> {t('pos')}
                  </span>
                }>
                Employee
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <GroupOutlined /> {t('unit')}
                  </span>
                }>
                Vietnam Education Unit
              </Descriptions.Item>
            </Descriptions>
          </Box>
        </Card>
      </Box>
    </Container>
  )
}

export default withTranslation('profile')(UserProfile)
