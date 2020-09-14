import React from 'react'
import {Box} from 'theme-ui'
import HomeComponent from 'components/Home'
import axios from 'utils/axios'
import {parseCookies} from 'nookies'
import {NextPage} from 'next'
import getMonth from 'date-fns/getMonth'
import getYear from 'date-fns/getYear'

const Home: NextPage<{preWorkingData}> = ({preWorkingData}) => {
  return (
    <Box>
      <HomeComponent preWorkingData={preWorkingData} />
    </Box>
  )
}

Home.getInitialProps = async (pageContext): Promise<any> => {
  try {
    const cookies = parseCookies(pageContext)
    const currentMonth = getMonth(new Date()) + 1
    const currentYear = getYear(new Date())
    const {
      data: {data: preWorkingData},
    } = await axios({
      url: '/v1/work_times',
      method: 'get',
      headers: {
        Authorization: `${cookies.token}`,
      },
      params: {
        year: currentYear,
        month: currentMonth,
      },
    })

    // console.log(currentMonth, currentYear)
    // console.log(workingData)
    return {preWorkingData, namespacesRequired: ['profile', 'common']}
  } catch (error) {
    console.log(error)
    return {namespacesRequired: ['profile', 'common']}
  }
}

export default Home
