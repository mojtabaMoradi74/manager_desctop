/* eslint-disable */
import {useQuery, useMutation, useQueryClient} from 'react-query'
import {calcTotalPages} from 'src/utility/functions'
import axiosInstance from 'src/utils/axios'
// import ApiCall from '_clients/apiCall';

export const useGetTicket = (id) => {
  return useQuery(
    `get-ticket-${id}`,
    async () => {
      const res = await axiosInstance().get(`/manager/ticket/${id}`)
      return res?.data?.data
    }
    //  ApiCall('GET', `/manager/ticket/${id}`, null, null, (res) => res?.data?.data || [])
  )
}
export const useGetTicketReplies = (params) => {
  return useQuery(
    ['get-ticket-replies', params],
    async () => {
      const res = await axiosInstance().get(`/manager/reply`, {params})
      return {
        list: res?.data?.data?.data || [],
        totalPage: calcTotalPages(res?.data?.data?.total, res?.data?.data?.pageSize),
        total: res?.data?.data?.total,
      }
    },

    // ApiCall('GET', '/manager/reply', null, params, (res) => ({
    //     list: res?.data?.data?.data || [],
    //     totalPage: calcTotalPages(res?.data?.data?.total, res?.data?.data?.pageSize),
    //     total: res?.data?.data?.total,
    //   }))
    {keepPreviousData: true}
  )
}

export const usePostTicketReply = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data) => {
      return await axiosInstance().post(`/manager/reply`, data)
    },

    // ApiCall('post', '/manager/reply', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('get-ticket-replies')
      },
    }
  )
}
export const usePutTicket = (id) => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data) => {
      return await axiosInstance().put(`/manager/ticket`, data)
      // ApiCall('put', '/manager/ticket', data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`get-ticket-${id}`)
      },
    }
  )
}

export const usePutTicketStatus = (id) => {
  const queryClient = useQueryClient()
  return useMutation(
    async (data) => {
      return await axiosInstance().put(`/manager/ticket/${id}`, data)
      // ApiCall('put', '/manager/ticket', data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`get-ticket-${id}`)
      },
    }
  )
}
