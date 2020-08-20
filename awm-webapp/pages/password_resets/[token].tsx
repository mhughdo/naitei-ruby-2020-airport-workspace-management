/** @jsx jsx */
import ResetPassword from '@components/ResetPassword'
import {jsx, Box} from 'theme-ui'

const PasswordReset: React.FC = () => {
  return (
    <Box>
      <ResetPassword />
    </Box>
  )
}

PasswordReset.displayName = 'PasswordReset'

export default PasswordReset
