import {useParams} from 'react-router-dom'
import {Route, Routes} from 'react-router'
import Enum from './enum'
import List from './List'
import Add from './Add'
import buildAccess from '../../permission/buildAccess'
import PermissionRoute from '../../permission/permissionRoute'
import {travelTypeObject} from '../../enumeration/index'

const Users = () => {
  // const urlParams = useParams();

  const access = buildAccess(Enum.routes.name)

  return (
    <Routes>
      <Route
        path={`${Enum.routes.add}`}
        element={<PermissionRoute element={<Add access={access} />} permissions={access?.create} />}
      />
      <Route
        path={`${Enum.routes.edit}/:id`}
        element={<PermissionRoute element={<Add access={access} />} permissions={access?.update} />}
      />

      <Route
        path={`*`}
        element={
          <PermissionRoute element={<List access={access} />} permissions={Object.values(access)} />
        }
      />
    </Routes>
  )
}

export default Users
