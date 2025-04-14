import { Route, Routes } from 'react-router';
import PermissionRoute from 'src/permission/permissionRoute';
import buildAccess from 'src/permission/buildAccess';
import Enum from './enum';
import List from './List';
import Add from './Add';
import Show from './Show';

const Profiles = () => {
  const access = buildAccess(Enum.routes.name);

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
        path={`${Enum.routes.show}/:id/:tab/*`}
        element={<PermissionRoute element={<Show access={access} />} permissions={access?.read} />}
      />
      <Route
        path={`${Enum.routes.list}`}
        element={<PermissionRoute element={<List access={access} />} permissions={access?.read} />}
      />
    </Routes>
  );
};

export default Profiles;
