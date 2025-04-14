import PropTypes from 'prop-types'
import {Navigate} from 'react-router-dom'
// hooks
import useAuth from '../hooks/useAuth'
// routes
import {routes} from '../routes/paths'

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
}

export default function GuestGuard({children}) {
  const {isAuthenticated} = useAuth()

  if (isAuthenticated) {
    return <Navigate to={routes.root} replace />
  }

  return <>{children}</>
}
