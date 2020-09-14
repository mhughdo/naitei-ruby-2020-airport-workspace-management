import {useQuery, QueryResult} from 'react-query'
import axios from 'utils/axios'

function useRequestStats({
  month,
  year,
}: {
  month?: number
  year: number
}): QueryResult<any, any> {
  return useQuery(['request_stats', month, year], async () => {
    return axios({
      url: '/v1/statistic/requests',
      method: 'get',
      params: {
        year,
        ...(month && {month}),
      },
    })
  })
}

export default useRequestStats
