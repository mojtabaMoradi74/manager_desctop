import { Link, NavLink, useLocation, useNavigate, useParams, useSearchParams, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Enum from '../enum';
// import useSettings from '../../../hooks/useSettings';
// import useQueryString from '../../../utils/useQueryString';
import AgentComponent from './Agent';
import SpecificationComponent from './Specification';
import SocialComponent from './Social';
import ShowCaravansManagementLayout from './Layout';
import CaravansManagementShowMessage from './Messages';
import CaravansManagementShowBank from './Bank';
import ProfileAccess from './Access';

const ShowCaravansManagement = () => {
  const { t } = useTranslation();
  const queryParams = useParams();
  console.log({ queryParams });
  // const queryString = useQueryString();
  // const location = useLocation();
  // const { themeStretch } = useSettings();
  // const backUrl = `${Enum.routes.root(queryParams.type, queryParams.travel)}`;
  // const paramId = queryParams?.id;

  const Component = {
    [Enum.enumTab.object.specification.value]: <SpecificationComponent />,
    [Enum.enumTab.object.access.value]: <ProfileAccess />,
    [Enum.enumTab.object.message.value]: <CaravansManagementShowMessage />,
    [Enum.enumTab.object.bank.value]: <CaravansManagementShowBank />,
  };

  return <>{Component[queryParams.tab] || <ShowCaravansManagementLayout />}</>;
  // <Routes>
  //   <Route path={`/:type`} element={<ShowCaravansManagement />} />
  // </Routes>
};

export default ShowCaravansManagement;
