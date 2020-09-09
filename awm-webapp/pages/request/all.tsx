import React from 'react'
import AllRequests from 'components/AllRequests'
import {Box} from 'theme-ui'
import {parseCookies} from 'nookies'
import {User} from '@providers/Auth'
import {NextPage} from 'next'
import {Router} from 'i18n'

const AllRequestsPage: NextPage = () => {
  return (
    <Box>
      <AllRequests />
    </Box>
  )
}

AllRequestsPage.getInitialProps = (pageContext): any => {
  let isAuthorized = false
  let location = '/'
  try {
    const cookies = parseCookies(pageContext)
    let auth = JSON.parse(cookies.auth) as User

    if (auth?.position_name === 'Manager') {
      isAuthorized = true
    }
  } catch (error) {
    console.log(error.message)
  }

  console.log(isAuthorized)
  if (!isAuthorized) {
    if (pageContext?.res) {
      pageContext.res.writeHead(302, {Location: location})
      pageContext.res.end()
    } else if (typeof window !== 'undefined') {
      Router.push(location)
    }
  }

  return {namespacesRequired: ['request']}
}

export default AllRequestsPage
