/** @jsx jsx */
import {Col, PageHeader, Row, Statistic} from 'antd'
import {WithTranslation, withTranslation} from 'i18n'
import {NextPage} from 'next'
import {jsx, Flex, Box, Text} from 'theme-ui'
import {LikeOutlined, CheckOutlined} from '@ant-design/icons'
import getMonth from 'date-fns/getMonth'
import getYear from 'date-fns/getYear'
import useDaysOff from 'hooks/useDaysOff'
import useRequestStats from 'hooks/useRequestStats'

const Statistics: NextPage<WithTranslation> = ({t}) => {
  const year = getYear(new Date())
  const month = getMonth(new Date()) + 1

  const {data: daysOffResMonthly} = useDaysOff({month, year})
  const {data: daysOffResYearly} = useDaysOff({year})
  const {data: requestStatsMonthly} = useRequestStats({month, year})
  const {data: requestStatsYearly} = useRequestStats({year})

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
        title={t('month')}
      />
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title={t('approved')}
            value={requestStatsMonthly?.data?.data?.approved ?? '--'}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t('rejected')}
            value={requestStatsMonthly?.data?.data?.rejected ?? '--'}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t('total_leave')}
            value={daysOffResMonthly?.data?.data?.leave ?? '--'}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t('total_awol')}
            value={daysOffResMonthly?.data?.data?.awol ?? '--'}
          />
        </Col>
      </Row>
      <PageHeader
        sx={{
          fontSize: 5,
          pl: 0,
        }}
        title={t('year')}
      />
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title={t('approved')}
            value={requestStatsYearly?.data?.data?.approved ?? '--'}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t('rejected')}
            value={requestStatsYearly?.data?.data?.rejected ?? '--'}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t('total_leave')}
            value={daysOffResYearly?.data?.data?.leave ?? '--'}
            suffix='/ 14'
          />
        </Col>
        <Col span={6}>
          <Statistic
            title={t('total_awol')}
            value={daysOffResYearly?.data?.data?.awol ?? '--'}
          />
        </Col>
      </Row>
    </Box>
  )
}

Statistics.getInitialProps = (): any => ({namespacesRequired: ['stats']})

export default withTranslation('stats')(Statistics)
