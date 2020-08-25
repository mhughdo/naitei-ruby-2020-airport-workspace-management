import {useQuery} from 'react-query'
import axios from 'utils/axios'
import {useAuth} from 'providers/Auth'

function useUserProfile() {
  const {isAuthenticated} = useAuth()

  return useQuery('user_profile', async () => {
    if (isAuthenticated) {
      return axios({
        url: '/v1/profile',
        method: 'get',
      })
    }

    return null
  })
}

export default useUserProfile
