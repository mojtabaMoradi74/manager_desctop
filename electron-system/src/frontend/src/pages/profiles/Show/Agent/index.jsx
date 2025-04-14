import { Route, Routes } from 'react-router';
import List from './List';
// import Add from './Add';

const CaravansManagementShowAgent = () => {
  return (
    <Routes>
      {/* <Route path={`${Enum.routes.add}`} element={<Add />} />
      <Route path={`${Enum.routes.edit}/:id`} element={<Add />} /> */}
      <Route path={`/`} element={<List />} />
    </Routes>
  );
};

export default CaravansManagementShowAgent;
