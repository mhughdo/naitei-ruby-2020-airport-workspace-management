/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
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
  message,
  Space,
  Tooltip,
} from 'antd'
import {EditOutlined, PlusOutlined} from '@ant-design/icons'
import {withTranslation, Router} from 'i18n'
import {queryCache, useMutation, useQuery} from 'react-query'
import {formatDate} from '@utils/date'
import axios from 'utils/axios'
import {useState} from 'react'
import {useForm} from 'antd/lib/form/Form'

const StatusColors = {
  Approved: 'green',
  Pending: 'geekblue',
  Rejected: 'red',
}

const RequestList = ({t}) => {
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const [updateConfirmLoading, setUpdateConfirmLoading] = useState<boolean>(
    false
  )
  const [selectedID, setSelectedID] = useState<number>(null)
  const [updateReqForm] = useForm()

  const {isLoading, data, isFetching, isError} = useQuery(
    'my_request',
    async () => {
      return axios({
        url: '/v1/profile/requests',
        method: 'get',
      })
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
        queryCache.invalidateQueries('my_request')
      },
    }
  )

  if (isError) {
    message.error(t('error'))
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
        }}>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => Router.push('/request/new')}>
          {t('new_req')}
        </Button>
      </Box>
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
        pagination={false}
      />
    </Box>
  )
}

export default withTranslation(['request', 'common'])(RequestList)
