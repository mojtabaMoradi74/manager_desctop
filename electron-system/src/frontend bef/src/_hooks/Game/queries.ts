import ApiCall from '_clients/apiCall'
import {useQuery} from 'react-query'

export const useGetMatchParticipant = (params) =>
  useQuery(['match-participant', params], () =>
    ApiCall('GET', '/manager/submitted-task', null, params, (res: any) => ({
      list: res?.data?.data,
    }))
  )
