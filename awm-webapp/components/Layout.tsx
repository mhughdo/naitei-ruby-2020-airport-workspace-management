/** @jsx jsx */
import {jsx, Image, Flex, Box} from 'theme-ui'
import {Layout, Menu, Avatar, Dropdown} from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import React, {useState} from 'react'

const {Header, Sider, Content} = Layout

const DropdownMenuItem = (
  <Menu>
    <Menu.Item key='0'>
      <a href='#'>1st menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key='1'>
      <a href=''>2nd menu item</a>
    </Menu.Item>
    <Menu.Item key='3'>
      <a href='#'>3rd menu items</a>
    </Menu.Item>
  </Menu>
)

const LayoutComponent: React.FunctionComponent = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const handleDropdownVisibleChange = (visible: boolean) => {
    setDropdownVisible(visible)
  }

  return (
    <Layout
      sx={{
        minHeight: '100vh',
      }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Box
          sx={{
            // height: '32px',
            // background: 'rgba(255, 255, 255, 0.2)',
            // bg: 'white',
            margin: '16px',
          }}>
          <Image src='/logo.png' />
        </Box>
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
          <Menu.Item key='1' icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key='2' icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key='3' icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          sx={{
            bg: (theme) => theme.colors.gray[1],
            px: 4,
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
            <Box>
              <Dropdown
                arrow
                overlay={DropdownMenuItem}
                trigger={['click']}
                onVisibleChange={handleDropdownVisibleChange}>
                <Box
                  sx={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}>
                  <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                  {dropdownVisible ? (
                    <UpOutlined
                      style={{
                        fontSize: '12px',
                        marginLeft: '8px',
                        fontWeight: 'bold',
                        verticalAlign: 'middle',
                      }}
                    />
                  ) : (
                    <DownOutlined
                      style={{
                        fontSize: '12px',
                        marginLeft: '8px',
                        fontWeight: 'bold',
                        verticalAlign: 'middle',
                      }}
                    />
                  )}
                </Box>
              </Dropdown>
            </Box>
          </Flex>
        </Header>
        <Content
          sx={{
            background: 'white',
            mt: 5,
            mx: 4,
            p: 5,
          }}>
          Content
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutComponent
