import axiosInstance from '../utils/axios';

export const getAllProducts = (page = 1, perPage = 10) =>
  axiosInstance().get(`/api/admin/product?page=${page}&perPage=${perPage}`);

export const createProduct = (data) => axiosInstance().post('/api/admin/product', data);

export const getProductCategories = () => axiosInstance().get(`/api/admin/product-category?perpage=100`);
