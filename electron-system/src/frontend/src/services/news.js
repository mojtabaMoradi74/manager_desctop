import axiosInstance from '../utils/axios';

export const createNews = (data) => axiosInstance().post('/api/admin/news', data);

export const getAuthors = () => axiosInstance().get(`/api/admin/authors?perpage=20`);

export const getCategories = () => axiosInstance().get(`/api/admin/news-category?perpage=20`);
