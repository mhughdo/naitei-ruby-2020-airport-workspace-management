import React from 'react'
import {Box} from 'theme-ui'
import NewRequest from '@components/NewRequest'

const NewRequestPage = () => {
  return (
    <Box>
      <NewRequest />
    </Box>
  )
}

NewRequestPage.getInitialProps = (): any => ({
  namespacesRequired: ['request'],
})

export default NewRequestPage
