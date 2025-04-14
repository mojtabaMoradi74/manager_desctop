import axiosInstance from '../utils/axios';

// Client Type

export const getClientTypes = (page = 1, perPage = 10) =>
  axiosInstance().get(`/api/admin/client_type?page=${page}&perPage=${perPage}`);

export const getDetailClientType = (id) => axiosInstance().get(`/api/admin/client_type/${id}`);

export const createClientType = (data) => axiosInstance().post(`/api/admin/client_type`, data);

export const editClientType = (id, data) => axiosInstance().put(`/api/admin/client_type/${id}`, data);

export const deleteClientType = (id) => axiosInstance().delete(`/api/admin/client_type/${id}`);
