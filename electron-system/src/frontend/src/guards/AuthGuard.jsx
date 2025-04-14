import PropTypes from 'prop-types'
import {useMemo, useState} from 'react'
import {Navigate, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {refreshTokenSpacer} from 'src/enumeration'
// hooks
import useAuth from '../hooks/useAuth'
// pages
import Login from '../pages/auth/Login'
// components
import LoadingScreen from '../components/LoadingScreen'

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
}

export default function AuthGuard({children, isPublic}) {
  // const {isAuthenticated, isInitialized} = useAuth()
  const admin = useSelector((store) => store.admin)
  const tokenState = useSelector((state) => state.token)
  const refreshToken = tokenState?.refresh
  const accessToken = tokenState?.access
  const showComponent = useMemo(() => {
    const currentDate = +new Date()
    const valid = refreshToken
      ? accessToken?.expiresAt
        ? accessToken?.expiresAt - currentDate - refreshTokenSpacer
        : 0
      : 1
    if (!refreshToken) return false
    return valid >= 0
  })
  const {pathname} = useLocation()
  const [requestedLocation, setRequestedLocation] = useState(null)
  console.log(
    {
      admin,
      showComponent,
      tokenState,
      //  refreshToken, accessToken
    },
    !admin.data && !showComponent
  )
  if ((!admin.data || !showComponent) && refreshToken) {
    return <LoadingScreen />
  }

  if (!admin.data && !showComponent) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname)
    }
    return <Login />
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null)
    return <Navigate to={requestedLocation} />
  }

  return <>{children}</>
}
