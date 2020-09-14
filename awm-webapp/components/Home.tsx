/** @jsx jsx */
import {jsx, Box} from 'theme-ui'
import React, {useState} from 'react'
import {
  Calendar,
  Badge,
  PageHeader,
  Tag,
  Skeleton,
  Statistic,
  Row,
  Col,
  Button,
} from 'antd'
import {withTranslation} from 'i18n'
import {WithTranslation} from 'next-i18next'
import format from 'date-fns/format'
import useWorkingData from 'hooks/useWorkingData'
import useDaysOff from 'hooks/useDaysOff'
import getMonth from 'date-fns/getMonth'
import getYear from 'date-fns/getYear'

type WorkingStatus = 'On Time' | 'Late' | 'Leave' | 'AWOL'
type Shift = 'Shift 1' | 'Shift 2' | 'Shift 3'

type WorkingData = [
  {
    id: number
    time_start: number
    time_end: number
    work_time_status_name: WorkingStatus
    shift_name: Shift
    day: number
    month: number
    year: number
  }
]

const HomeComponent: React.FC<
  WithTranslation & {preWorkingData: WorkingData}
> = ({t, preWorkingData}) => {
  const [year, setYear] = useState<number>(getYear(new Date()))
  const [month, setMonth] = useState<number>(getMonth(new Date()) + 1)
  const {data, isFetching} = useWorkingData({
    month,
    year,
  })

  const {data: daysOffRes, isFetching: isDaysOffFetching} = useDaysOff({
    month,
    year,
  })

  const disabledDate = (currentDate) => {
    if (!data) return false
    if (isFetching) return false
    const {
      data: {data: workingData},
    } = data

    if (workingData?.length) {
      const day = currentDate.date()
      const newMonth = currentDate.month() + 1
      const dateData = workingData.find(
        (d) => d.day === day && d.month === newMonth
      )
      if (dateData?.work_time_status_name === 'Absence') {
        return true
      }
    }

    return false
  }

  const dateCellRender = (value) => {
    if (!data) return
    const {
      data: {data: workingData},
    } = data

    if (workingData?.length) {
      const day = value.date()
      const newMonth = value.month() + 1
      const timeFormat = 'HH:mm'
      const dateData = workingData.find(
        (d) => d.day === day && d.month === newMonth
      )
      if (!dateData) return
      const isOnTime = dateData?.work_time_status_name === 'On Time'

      if (!dateData?.time_start || !dateData?.time_end) {
        if (dateData?.work_time_status_name === 'Leave') {
          return (
            <Box>
              <Tag color='magenta'>{t(dateData.shift_name)}</Tag>
              <Badge
                sx={{
                  display: 'block',
                }}
                status='error'
                text={t('absence')}
              />
            </Box>
          )
        }
        if (dateData?.work_time_status_name === 'AWOL') {
          return (
            <Box>
              <Tag color='red'>{t(dateData.shift_name)}</Tag>
              <Badge
                sx={{
                  display: 'block',
                }}
                status='error'
                text={t('awol')}
              />
            </Box>
          )
        }
      }

      const time_start = format(
        new Date(Number(`${dateData?.time_start}000`)),
        timeFormat
      )
      const time_end = format(
        new Date(Number(`${dateData?.time_end}000`)),
        timeFormat
      )

      if (isFetching) {
        return (
          <Box>
            <Skeleton active />
          </Box>
        )
      }

      return (
        <Box>
          <Tag color={isOnTime ? 'green' : 'warning'}>
            {t(dateData.shift_name)}
          </Tag>
          <Badge
            sx={{
              display: 'block',
            }}
            status={isOnTime ? 'success' : 'warning'}
            text={`${time_start} - ${time_end}`}
          />
        </Box>
      )
    }
  }

  const onDateChange = async (date) => {
    setMonth(getMonth(new Date(date)) + 1)
    setYear(getYear(new Date(date)))
  }

  return (
    <Box
      sx={{
        bg: 'white',
      }}>
      <PageHeader
        sx={{
          fontSize: 5,
        }}
        title={t('timesheet')}
      />
      <Row
        gutter={16}
        sx={{
          px: 5,
        }}>
        <Col span={6}>
          <Statistic
            title={t('total_leave')}
            value={daysOffRes?.data?.data?.leave || '--'}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t('total_awol')}
            value={daysOffRes?.data?.data?.awol || '--'}
          />
        </Col>
      </Row>
      <Box
        sx={{
          p: 7,
          pt: 0,
        }}>
        <Calendar
          css={{
            '.ant-picker-calendar-date-content': {
              overflow: 'hidden !important',
            },
          }}
          onChange={onDateChange}
          disabledDate={disabledDate}
          dateCellRender={dateCellRender}
        />
      </Box>
    </Box>
  )
}

export default withTranslation(['home', 'common'])(HomeComponent)
