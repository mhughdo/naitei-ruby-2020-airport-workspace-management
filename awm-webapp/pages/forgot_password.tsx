import RequestResetPassword from '@components/RequestResetPassword'
import React from 'react'

const ForgotPassword: React.FC = () => {
  return (
    <div>
      <RequestResetPassword />
    </div>
  )
}

ForgotPassword.displayName = 'ForgotPassword'

export default ForgotPassword
