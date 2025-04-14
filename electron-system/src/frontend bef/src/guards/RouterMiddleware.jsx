import {Navigate, useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {routes} from '../routes/paths'
import useAuth from '../hooks/useAuth'

const RouterMiddleware = ({children}) => {
  const {isAuthenticated, isInitialized} = useAuth()
  const accessToken = window.localStorage.getItem('accessToken')

  // const admin = useSelector((store) => store.admin);
  const {pathname} = useLocation()
  console.log({pathname, isAuthenticated})
  if (pathname === '/') {
    if (isAuthenticated || accessToken) {
      return <Navigate to={routes.root} />
    }
    // return <Navigate to={routes.root} />;
  }
  return <>{children}</>
}

export default RouterMiddleware
