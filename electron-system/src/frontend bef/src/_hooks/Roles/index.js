import { useQuery } from 'react-query';
import ApiCall from '_clients/apiCall';

export const useGetSingleRole = (id) => {
  return useQuery(
    ['single-role', id],
    () => ApiCall('GET', `/manager/role/${id}`, null, null, (res) => res?.data?.data || []),
    { enabled: !!id, retry: 1 }
  );
};

export const useGetAllPermissions = (id) => {
  return useQuery(['all-permissions'], () =>
    ApiCall('GET', '/manager/permission', null, null, (res) => res?.data?.data || [])
  );
};
