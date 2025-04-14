import {store} from '../redux/store'

export const hasAccess = (accessPermission) => {
  if (!accessPermission) return true
  const {admin} = store.getState()
  if (admin?.data?.role?.superAdmin) return true
  const userPermissions = admin?.data?.permissions || {}
  // console.log('* * * PermissionRoute :', {userPermissions})

  if (typeof accessPermission === 'string') {
    return userPermissions[accessPermission]
  }
  if (accessPermission?.length) {
    return accessPermission?.find((x) => userPermissions[x])
  }
}
