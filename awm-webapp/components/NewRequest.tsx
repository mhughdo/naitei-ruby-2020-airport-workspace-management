/** @jsx jsx */
import {withTranslation} from 'i18n'
import {jsx, Flex, Box, Text} from 'theme-ui'
import {PageHeader, Form, Input, DatePicker, Button, message} from 'antd'
import moment from 'moment'
import {NextPage} from 'next'
import {WithTranslation} from 'next-i18next'
import {useAuth} from '@providers/Auth'
import {useEffect, useState} from 'react'
import {queryCache, useMutation} from 'react-query'
import axios from 'utils/axios'

const {RangePicker} = DatePicker

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
}

const NewRequest = ({t}) => {
  const {auth} = useAuth()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const [createRequest] = useMutation(
    async ({reason, absence_days}: any) => {
      await axios({
        url: '/v1/requests/new',
        method: 'post',
        data: {
          reason,
          absence_days,
        },
      })
    },
    {
      onError: (err, _, rollback: () => any) => {
        message.error(t('error'))
      },
      onSuccess: () => {
        message.success(t('create_success'))
        form.resetFields()
      },
      onSettled: () => {
        queryCache.invalidateQueries('my_request')
      },
    }
  )

  const onFinish = async (values) => {
    console.log('Received values of form: ', values)
    try {
      setLoading(true)
      await form.validateFields()
      const {reason, absence_days} = values
      const formattedDays = [
        ...new Set(
          absence_days.map((day) => `${Math.floor(day.valueOf() / 1000)}`)
        ),
      ]
      await createRequest({
        reason,
        absence_days: formattedDays,
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      message.error(t('error'))
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      name: auth.name,
      position: auth.position_name,
      unit: auth.unit_name,
    })
  }, [])

  return (
    <Box
      sx={{
        bg: 'white',
        px: 5,
        pb: 5,
      }}>
      <PageHeader
        sx={{
          fontSize: 5,
          pl: 0,
        }}
        title={t('new_req')}
      />
      <Box>
        <Form
          form={form}
          {...formItemLayout}
          name='new_request'
          onFinish={onFinish}
          scrollToFirstError>
          <Form.Item name='name' label={t('name')}>
            <Input disabled />
          </Form.Item>

          <Form.Item name='unit' label={t('unit')}>
            <Input disabled />
          </Form.Item>
          <Form.Item name='position' label={t('position')}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: t('required_input', {
                  inputName: t('absence_days').toLowerCase(),
                }),
              },
            ]}
            name='absence_days'
            label={t('absence_days')}>
            <RangePicker
              ranges={{
                [`${t('yesterday')}`]: [
                  moment().subtract(1, 'day'),
                  moment().subtract(1, 'day'),
                ],
                [`${t('today')}`]: [moment(), moment()],
                [`${t('3-days')}`]: [moment(), moment().add(3, 'days')],
                [`${t('1-week')}`]: [moment(), moment().add(7, 'days')],
              }}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: t('required_input', {
                  inputName: t('reason').toLowerCase(),
                }),
              },
            ]}
            name='reason'
            label={t('reason')}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit'>
              {t('create_request')}
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Box>
  )
}

export default withTranslation('request')(NewRequest)
