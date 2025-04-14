import { Route, Routes } from 'react-router';
import Enum from './enum';
import ById from './ById';

const PublicFormComponent = () => {
  // <div>{'PublicFormComponent'}</div>
  return (
    <Routes>
      <Route path={Enum.routes.byId} element={<ById />} />
    </Routes>
  );
};

export default PublicFormComponent;
