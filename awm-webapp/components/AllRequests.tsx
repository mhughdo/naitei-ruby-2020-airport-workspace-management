/* eslint-disable react/display-name */
/** @jsx jsx */
import {jsx, Box, Text, Flex} from 'theme-ui'
import {
  Button,
  Input,
  message,
  PageHeader,
  Popconfirm,
  Popover,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import {withTranslation} from 'i18n'
import React, {useState} from 'react'
import {useMutation, queryCache, useQuery} from 'react-query'
import axios from 'utils/axios'
import {CheckOutlined, CloseOutlined} from '@ant-design/icons'
import {useAuth} from '@providers/Auth'
import {formatDate} from '@utils/date'
import {WithTranslation} from 'next-i18next'

const StatusColors = {
  Approved: 'green',
  Pending: 'geekblue',
  Rejected: 'red',
}

const AllRequests: React.FC<WithTranslation> = ({t}) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')
  const {auth} = useAuth()
  const isManager = auth?.position_name === 'Manager'
  const {isLoading, data, isFetching, isError, error} = useQuery(
    'all_requests',
    async () => {
      return axios({
        url: '/v1/unit/requests',
        method: 'get',
      })
    },
    {
      onError: (error: any) => {
        const errMsg = error?.response?.data?.error
        message.error(errMsg || t('error'))
      },
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  const [approve] = useMutation(
    async ({id}: any) => {
      await axios({
        url: `/v1/requests/${id}/approve`,
        method: 'put',
      })
    },
    {
      onError: (err: any, _, rollback: () => any) => {
        const errMsg = err?.response?.data?.error
        message.error(errMsg || t('error'))
      },
      onSuccess: () => {
        message.success(t('approve_success'))
      },
      onSettled: () => {
        queryCache.invalidateQueries('all_requests')
      },
    }
  )

  const [reject, {isLoading: isRejectLoading}] = useMutation(
    async ({id}: any) => {
      await axios({
        url: `/v1/requests/${id}/reject`,
        method: 'put',
        ...(comment && {data: {comment}}),
      })
    },
    {
      onError: (err: any, _, rollback: () => any) => {
        const errMsg = err?.response?.data?.error
        message.error(errMsg || t('error'))
      },
      onSuccess: () => {
        setVisible(false)
        setComment('')
        message.success(t('reject_success'))
      },
      onSettled: () => {
        queryCache.invalidateQueries('all_requests')
      },
    }
  )

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('requester'),
      dataIndex: 'requester_name',
      key: 'requester_name',
    },
    {
      title: t('day'),
      dataIndex: 'absence_days',
      key: 'absence_days',
      render: (text, record) => {
        const absence_days = record.absence_days.split(',') as string[]
        const formatDays = [...new Set(absence_days.filter(Boolean))].map(
          (day: string) => {
            return formatDate(Number(day) * 1000)
          }
        )

        // eslint-disable-next-line operator-linebreak
        const daysText =
          formatDays.length > 1
            ? `${formatDays[0].slice(0, 2)}-${
                formatDays[formatDays.length - 1]
              }`
            : formatDays[0]
        return <Text>{daysText}</Text>
      },
    },
    {
      title: t('reason'),
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: t('unit'),
      dataIndex: 'unit_name',
      key: 'unit_name',
    },
    {
      title: t('approver'),
      dataIndex: 'approver_name',
      key: 'approver_name',
    },
    {
      title: t('status'),
      key: 'request_status_name',
      dataIndex: 'request_status_name',
      filters: [
        {
          text: 'Approved',
          value: 'Approved',
        },
        {
          text: 'Pending',
          value: 'Pending',
        },
        {
          text: 'Rejected',
          value: 'Rejected',
        },
      ],
      onFilter: (value, record) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        record.request_status_name.indexOf(value) === 0,
      render: (tag) => {
        return (
          <Tag color={StatusColors[tag] || 'geekblue'} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        )
      },
    },
    {
      title: t('comment'),
      dataIndex: 'comment',
    },
    {
      title: t('action'),
      key: 'action',
      render: (text, record) => {
        return (
          <Space size='middle'>
            {isManager && record.request_status_name === 'Pending' && (
              <>
                <Tooltip placement='top' title={t('approve')}>
                  <Popconfirm
                    title={t('rus', {action: t('approve').toLowerCase()})}
                    onConfirm={() => approve({id: record.id})}
                    okText={t('y')}
                    cancelText={t('n')}>
                    <CheckOutlined
                      sx={{
                        color: '#1890ff',
                      }}
                    />
                  </Popconfirm>
                </Tooltip>

                <Tooltip placement='top' title={t('reject')}>
                  <Popover
                    content={
                      <Box>
                        <Input
                          onChange={(event) => setComment(event.target.value)}
                          value={comment}
                          size='small'
                          placeholder={t('comment')}
                        />
                        <Flex
                          sx={{
                            mt: 2,
                            justifyContent: 'end',
                          }}>
                          <Button
                            size='small'
                            onClick={() => {
                              setVisible(false)
                              setComment('')
                            }}>
                            {t('n')}
                          </Button>
                          <Button
                            size='small'
                            type='primary'
                            disabled={isRejectLoading}
                            onClick={() => {
                              reject({id: record.id})
                            }}
                            sx={{
                              ml: 1,
                            }}>
                            {t('y')}
                          </Button>
                        </Flex>
                      </Box>
                    }
                    placement='topRight'
                    title={t('rus', {action: t('reject').toLowerCase()})}
                    trigger='click'
                    visible={visible}
                    onVisibleChange={setVisible}>
                    {/* <Button type='primary'>Click me</Button> */}
                    <CloseOutlined
                      sx={{
                        color: '#1890ff',
                      }}
                    />
                  </Popover>
                  {/* <Button type='link' onClick={() => reject({id: record.id})}>
                  </Button> */}
                </Tooltip>
              </>
            )}
          </Space>
        )
      },
    },
  ]
  return (
    <Box
      sx={{
        bg: 'white',
        px: 6,
      }}>
      <PageHeader
        sx={{
          fontSize: 5,
          pl: 0,
        }}
        title={t('all_req')}
      />
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={data?.data?.data}
        pagination={false}
      />
    </Box>
  )
}

export default withTranslation('request')(AllRequests)
