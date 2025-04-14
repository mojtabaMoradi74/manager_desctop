import { Route, Routes } from 'react-router';
import List from './List';
// import Add from './Add';

const CaravansManagementShowBank = () => {
  return (
    <Routes>
      {/* <Route path={`/add`} element={<Add />} />
      <Route path={`/edit/:id`} element={<Add />} /> */}
      <Route path={`/`} element={<List />} />
    </Routes>
  );
};

export default CaravansManagementShowBank;
