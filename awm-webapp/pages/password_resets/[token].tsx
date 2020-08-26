/** @jsx jsx */
import ResetPassword from '@components/ResetPassword'
import {NextPage} from 'next'
import {jsx, Box} from 'theme-ui'
import axios from 'utils/axios'

const PasswordReset: NextPage<{isValidToken: boolean}> = ({isValidToken}) => {
  return (
    <Box>
      <ResetPassword isValidToken={isValidToken} />
    </Box>
  )
}

PasswordReset.displayName = 'PasswordReset'

PasswordReset.getInitialProps = async (pageContext): Promise<any> => {
  try {
    const {query} = pageContext
    const {token, email} = query

    if (!email) {
      return {isValidToken: false}
    }

    const {data} = await axios({
      url: '/v1/auth/password/valid-reset-token',
      method: 'post',
      data: {
        email,
        token,
      },
    })

    if (data?.message) {
      return {isValidToken: true}
    }
  } catch (error) {
    return {isValidToken: false}
  }
}

export default PasswordReset
