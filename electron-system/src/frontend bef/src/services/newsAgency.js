import axiosInstance from '../utils/axios';

export const createNewsAgency = (data) => axiosInstance().post('/api/admin/news_agency', data);

export const editNewsAgency = (id, data) => axiosInstance().post(`/api/admin/news_agency/${id}`, data);

export const getAllNewsAgency = (page = 1, perPage = 10) =>
  axiosInstance().get(`/api/admin/news_agency?page=${page}&perPage=${perPage}`);

export const getAllNewsAgencyCategories = (page = 1, perPage = 10) =>
  axiosInstance().get(`/api/admin/news_agency/category?page=${page}&perPage=${perPage}`);

export const getNewsAgencyData = (id) => axiosInstance().get(`/api/admin/news_agency/${id}`);

export const deleteNewsAgency = (id) => axiosInstance().delete(`/api/admin/news_agency/${id}`);

// Old

export const createNews = (data) => axiosInstance().post('/api/admin/news', data);

export const getAuthors = () => axiosInstance().get(`/api/admin/authors?perpage=20`);

export const getCategories = () => axiosInstance().get(`/api/admin/news-category?perpage=20`);
