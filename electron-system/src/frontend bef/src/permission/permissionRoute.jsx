import {Route} from 'react-router-dom'
import {hasAccess} from './utiles'
import Page403 from '../pages/Page403'

const PermissionRoute = ({element, permissions}) => {
  // console.log('* * * PermissionRoute :', {permissions})
  if (hasAccess(permissions)) {
    // if (true) {
    return element
  }

  //   <Navigate to="/404" replace />
  //   return null;
  return <Page403 />
}

export default PermissionRoute
