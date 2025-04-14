import { useQuery } from 'react-query';
import ApiCall from '_clients/apiCall';

export const useGetNotification = (params: any, accessToken: any) => {
    return useQuery('get-notifications', () =>
        ApiCall('GET', `/manager/notifications`, null, params, (res) => res?.data?.data?.data || []),
        {
            enabled: accessToken ? true : false
        }
    )
}