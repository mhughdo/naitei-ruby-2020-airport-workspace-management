import {useQuery, QueryResult} from 'react-query'
import axios from 'utils/axios'

function useDaysOff({
  month,
  year,
}: {
  month?: number
  year: number
}): QueryResult<any, any> {
  return useQuery(['days_off', month, year], async () => {
    return axios({
      url: '/v1/statistic/day_off',
      method: 'get',
      params: {
        year,
        ...(month && {month}),
      },
    })
  })
}

export default useDaysOff
