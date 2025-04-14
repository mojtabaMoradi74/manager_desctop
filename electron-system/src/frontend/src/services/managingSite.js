import axiosInstance from '../utils/axios';

export const getVipDiscounts = () => axiosInstance().get('/api/admin/general_discount');

export const createVipDiscounts = (data) => axiosInstance().post('/api/admin/general_discount', data);
