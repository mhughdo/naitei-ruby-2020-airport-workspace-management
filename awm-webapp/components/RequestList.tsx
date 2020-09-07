/* eslint-disable react/display-name */
/** @jsx jsx */
import {jsx, Box, Text} from 'theme-ui'
import {
  Table,
  Tag,
  Button,
  PageHeader,
  Modal,
  Input,
  Form,
  DatePicker,
  message,
  Space,
  Tooltip,
} from 'antd'
import {CheckOutlined, CloseOutlined, EditOutlined} from '@ant-design/icons'
import {withTranslation} from 'i18n'
import {NextPage} from 'next'
import {WithTranslation} from 'next-i18next'
import {queryCache, useMutation, useQuery} from 'react-query'
import {formatDate} from '@utils/date'
import axios from 'utils/axios'
import {useState} from 'react'
import {useForm} from 'antd/lib/form/Form'
import moment from 'moment'
import {useAuth} from '@providers/Auth'
import compareAsc from 'date-fns/compareAsc'

const StatusColors = {
  Approved: 'green',
  Pending: 'geekblue',
  Rejected: 'red',
}

const RequestList: NextPage<WithTranslation> = ({t}) => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const [updateConfirmLoading, setUpdateConfirmLoading] = useState<boolean>(
    false
  )
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [selectedID, setSelectedID] = useState<number>(null)
  const [createReqForm] = useForm()
  const [updateReqForm] = useForm()
  const {auth} = useAuth()
  const isManager = auth?.position_name === 'Manager'
  const request_name = isManager ? 'all_requests' : 'personal_requests'
  const request_url = isManager ? '/v1/unit/requests' : '/v1/profile/requests'
  const {isLoading, data, isFetching, isError} = useQuery(
    request_name,
    async () => {
      return axios({
        url: request_url,
        method: 'get',
      })
    }
  )

  const [createRequest] = useMutation(
    async ({reason, absence_day}: any) => {
      await axios({
        url: '/v1/requests/new',
        method: 'post',
        data: {
          reason,
          absence_day: Math.floor(absence_day / 1000),
        },
      })
    },
    {
      onError: (err, _, rollback: () => any) => {
        message.error(t('error'))
      },
      onSuccess: () => {
        message.success(t('create_success'))
      },
      onSettled: () => {
        queryCache.invalidateQueries(request_name)
      },
    }
  )

  const [updateRequest] = useMutation(
    async ({reason}: any) => {
      await axios({
        url: `/v1/requests/${selectedID}/update`,
        method: 'put',
        data: {
          reason,
        },
      })
    },
    {
      onError: (err, _, rollback: () => any) => {
        message.error(t('error'))
      },
      onSuccess: () => {
        message.success(t('update_success'))
      },
      onSettled: () => {
        queryCache.invalidateQueries(request_name)
      },
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
      onError: (err, _, rollback: () => any) => {
        message.error(t('error'))
      },
      onSuccess: () => {
        message.success(t('approve_success'))
      },
      onSettled: () => {
        queryCache.invalidateQueries(request_name)
      },
    }
  )

  const [reject] = useMutation(
    async ({id}: any) => {
      await axios({
        url: `/v1/requests/${id}/reject`,
        method: 'put',
      })
    },
    {
      onError: (err, _, rollback: () => any) => {
        message.error(t('error'))
      },
      onSuccess: () => {
        message.success(t('reject_success'))
      },
      onSettled: () => {
        queryCache.invalidateQueries(request_name)
      },
    }
  )

  if (isError) {
    message.error(t('error'))
  }

  const handleCreateRequest = async () => {
    try {
      setConfirmLoading(true)
      await createReqForm.validateFields()
      const fieldsValue = createReqForm.getFieldsValue()
      const {reason, absence_day} = fieldsValue
      await createRequest({
        reason,
        absence_day: new Date(absence_day).getTime(),
      })
      setConfirmLoading(false)
      setCreateModalVisible(false)
    } catch (error) {
      setConfirmLoading(false)
      message.error(t('error'))
    }
  }

  const handleUpateRequest = async () => {
    try {
      setUpdateConfirmLoading(true)
      await updateReqForm.validateFields()
      const fieldsValue = updateReqForm.getFieldsValue()
      const {reason} = fieldsValue
      await updateRequest({
        reason,
      })
      setUpdateConfirmLoading(false)
      setUpdateModalVisible(false)
    } catch (error) {
      setUpdateConfirmLoading(false)
      message.error(t('error'))
    }
  }

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
      dataIndex: 'absence_day',
      key: 'absence_day',
      render: (text) => <Text>{formatDate(Number(text * 1000))}</Text>,
      sorter: (a, b) => compareAsc(a.absence_day * 1000, b.absence_day * 1000),
      // sortDirections: ['descend', 'ascend'],
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
            {record.request_status_name === 'Pending' && (
              <Tooltip placement='top' title={t('edit')}>
                <Button
                  type='link'
                  onClick={() => {
                    setSelectedID(record.id)
                    updateReqForm.setFieldsValue({
                      reason: record.reason,
                    })
                    setUpdateModalVisible(true)
                  }}>
                  <EditOutlined />
                </Button>
              </Tooltip>
            )}
            {isManager && record.request_status_name === 'Pending' && (
              <>
                <Tooltip placement='top' title={t('approve')}>
                  <Button type='link' onClick={() => approve({id: record.id})}>
                    <CheckOutlined />
                  </Button>
                </Tooltip>

                <Tooltip placement='top' title={t('reject')}>
                  <Button type='link' onClick={() => reject({id: record.id})}>
                    <CloseOutlined />
                  </Button>
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
        title={t('page_header')}
      />
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'end',
        }}>
        <Button
          type='primary'
          onClick={() => {
            createReqForm.resetFields()
            setCreateModalVisible(true)
          }}>
          {t('create_request')}
        </Button>
      </Box>
      <Modal
        title={t('create_request')}
        visible={createModalVisible}
        onOk={handleCreateRequest}
        confirmLoading={confirmLoading}
        onCancel={() => setCreateModalVisible(false)}>
        <Form form={createReqForm} layout='vertical'>
          <Form.Item
            name='reason'
            label={t('reason')}
            rules={[
              {
                required: true,
                message: t('please_input'),
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item name='absence_day' label={t('day')}>
            <DatePicker
              disabledDate={(current) => {
                return (
                  current && current < moment().subtract(1, 'd').endOf('day')
                )
              }}
              sx={{
                width: '100%',
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={t('update_request')}
        visible={updateModalVisible}
        onOk={handleUpateRequest}
        confirmLoading={updateConfirmLoading}
        onCancel={() => {
          setUpdateModalVisible(false)
        }}>
        <Form form={updateReqForm} layout='vertical'>
          <Form.Item label='ID'>
            <span>{selectedID}</span>
          </Form.Item>
          <Form.Item
            name='reason'
            label={t('reason')}
            rules={[
              {
                required: true,
                message: t('please_input'),
              },
            ]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={data?.data?.data}
      />
    </Box>
  )
}

// RequestList.getInitialProps = (): any => ({
//   namespacesRequired: ['request', 'common'],
// })

export default withTranslation(['request', 'common'])(RequestList)
