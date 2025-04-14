import axiosInstance from '../utils/axios';

export const getAllSellers = (page = 1, perPage = 10) =>
  axiosInstance().get(`/api/admin/seller?page=${page}&perPage=${perPage}`);

export const getAllSellersWithSearch = (search) => axiosInstance().get(`/api/admin/seller?search=${search}`);

export const getSellerDetail = (id) => axiosInstance().get(`/api/admin/seller/${id}`);

export const createSeller = (data) => axiosInstance().post('/api/admin/seller', data);

export const editSeller = (id, data) => axiosInstance().put(`/api/admin/seller/${id}`, data);

export const deleteSeller = (id) => axiosInstance().delete(`/api/admin/seller/${id}`);

export const addSellerContact = (data) => axiosInstance().post(`/api/admin/call`, data);

export const editSellerContact = (id, data) => axiosInstance().put(`/api/admin/call/${id}`, data);

export const addSellerBankAccount = (data) => axiosInstance().post(`/api/admin/bank`, data);

export const editSellerBankAccount = (id, data) => axiosInstance().put(`/api/admin/bank/${id}`, data);

export const createSpecialContentPlaylist = (data) => axiosInstance().post('/api/admin/seller', data);
