import {Route, Routes} from 'react-router'
import Enum from './enum'
import List from './List'
import Add from './Add'
import buildAccess from '../../../permission/buildAccess'
import PermissionRoute from '../../../permission/permissionRoute'

const AttributeValues = () => {
  const access = buildAccess(Enum.routes.name)

  return (
    <Routes>
      <Route
        path={`/:parent${Enum.routes.add}`}
        element={<PermissionRoute element={<Add access={access} />} permissions={access?.create} />}
      />
      <Route
        path={`/:parent${Enum.routes.edit}/:id`}
        element={<PermissionRoute element={<Add access={access} />} permissions={access?.update} />}
      />

      <Route
        path={`/:parent`}
        element={
          <PermissionRoute element={<List access={access} />} permissions={Object.values(access)} />
        }
      />
    </Routes>
  )
}

export default AttributeValues
