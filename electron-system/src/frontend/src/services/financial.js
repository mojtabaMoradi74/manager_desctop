import axiosInstance from '../utils/axios';

export const getAllTransactions = (page = 1, perPage = 10) =>
  axiosInstance().get(`/api/admin/transaction?page=${page}&perPage=${perPage}`);
