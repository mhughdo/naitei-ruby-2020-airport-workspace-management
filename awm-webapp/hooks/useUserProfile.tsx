import {useQuery} from 'react-query'
import axios from 'utils/axios'

function useUserProfile(isAuthenticated: boolean): any {
  return useQuery(
    'user_profile',
    async () => {
      if (isAuthenticated) {
        return axios({
          url: '/v1/profile',
          method: 'get',
        })
      }

      return null
    },
    {
      refetchOnWindowFocus: true,
      refetchInterval: 60 * 1000,
    }
  )
}

export default useUserProfile
