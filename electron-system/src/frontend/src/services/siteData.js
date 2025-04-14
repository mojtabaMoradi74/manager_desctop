import axiosInstance from '../utils/axios';

// Country

export const getAllCountry = (page = 1, perPage = 12) =>
  axiosInstance().get(`/api/admin/country?page=${page}&perPage=${perPage}`);

export const getCountry = (id) => axiosInstance().get(`/api/admin/country/${id}`);

export const createNewCountry = (data) => axiosInstance().post(`/api/admin/country`, data);

export const editCountry = (id, data) => axiosInstance().post(`/api/admin/country/${id}`, data);

export const deleteCountry = (id) => axiosInstance().delete(`/api/admin/country/${id}`);

// Language

export const getAllLanguage = (page = 1, perPage = 12) =>
  axiosInstance().get(`/api/admin/language?page=${page}&perPage=${perPage}`);

export const getLanguage = (id) => axiosInstance().get(`/api/admin/language/${id}`);

export const createNewLanguage = (data) => axiosInstance().post(`/api/admin/language`, data);

export const editLanguage = (id, data) => axiosInstance().put(`/api/admin/language/${id}`, data);

export const deleteLanguage = (id) => axiosInstance().delete(`/api/admin/language/${id}`);

// System Log

export const getAllSystemLog = ({ type, page = 1, perPage = 12 }) =>
  axiosInstance().get(`/api/admin/log?page=${page}&perPage=${perPage}${type ? `&model=${type}` : ''}`);

// Notification

export const getAllNotification = ({ type, page = 1, perPage = 12 }) =>
  axiosInstance().get(`/api/admin/notification?page=${page}&perPage=${perPage}`);

export const editNotification = (id, data) => axiosInstance().put(`/api/admin/notification/${id}`, data);

// Export

export const exportExcel = (type) =>
  axiosInstance().get(`/api/admin/export?slug=${type}`, {
    responseType: 'blob',
  });
