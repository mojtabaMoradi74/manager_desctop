import { useQuery } from 'react-query';
import ApiCall from '_clients/apiCall';

export const useGetSingleAsset = (id) => {
  return useQuery(['blockchain/asset', id], () =>
    ApiCall('GET', `/manager/blockchain/asset/${id}`, null, null, (res) => res?.data?.data || [])
  );
};
