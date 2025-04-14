import {Navigate, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {routes} from '../routes/paths'
import useAuth from '../hooks/useAuth'

const PublicRouterMiddleware = ({children}) => {
  const {isAuthenticated, isInitialized} = useAuth()
  // const admin = useSelector((store) => store.admin);
  const {pathname} = useLocation()
  console.log({pathname})
  if (pathname === '/') {
    return <Navigate to={routes.root} />
  }
  return <>{children}</>
}

export default PublicRouterMiddleware
