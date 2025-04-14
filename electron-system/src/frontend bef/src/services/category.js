import axiosInstance from '../utils/axios';

export const getAllCategories = (page = 1) => axiosInstance().get(`/manager/category?page=${page}`);

export const getCategory = (id) => axiosInstance().get(`/manager/category/${id}`);

export const createCategory = (data) => axiosInstance().post(`/manager/category`, data);

export const updateCategory = (id, data) => axiosInstance().put(`/manager/category`, data);

export const deleteCategory = (id) => axiosInstance().delete(`/manager/category/${id}`);
