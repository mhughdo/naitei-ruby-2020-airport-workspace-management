import {useQuery, QueryResult} from 'react-query'
import axios from 'utils/axios'

function useWorkingData({
  month,
  year,
}: {
  month: number
  year: number
}): QueryResult {
  return useQuery(['working_data', month, year], async () => {
    return axios({
      url: '/v1/work_times',
      method: 'get',
      params: {
        year,
        month,
      },
    })
  })
}

export default useWorkingData
