import axiosInstance from '../utils/axios';

export const getAllBlogs = (page = 1) => axiosInstance().get(`/manager/blog?page=${page}`);

export const getBlog = (id) => axiosInstance().get(`/manager/blog/${id}`);

export const createBlog = (data) =>
  axiosInstance().post(`/manager/blog`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateBlog = (data) =>
  axiosInstance().put(`/manager/blog`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteBlog = (id) => axiosInstance().delete(`/manager/blog/${id}`);

// BLOG CATEGORY

export const getAllBlogCategories = (page = 1, perPage = 10) =>
  axiosInstance().get(`/manager/blog/categories?page=${page}`);
