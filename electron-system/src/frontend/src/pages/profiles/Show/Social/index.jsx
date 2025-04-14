import { Route, Routes } from 'react-router';
import Enum from './enum';
import List from './List';
import Add from './Add';

const CaravansManagement = () => {
  return (
    <Routes>
      <Route path={`${Enum.routes.add}`} element={<Add />} />
      <Route path={`${Enum.routes.edit}`} element={<Add />} />
      <Route path={`${Enum.routes.list}`} element={<List />} />
    </Routes>
  );
};

export default CaravansManagement;
