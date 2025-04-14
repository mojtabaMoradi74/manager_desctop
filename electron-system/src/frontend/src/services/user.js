import axiosInstance from '../utils/axios';

// Profile

export const getAllUsers = (page = 1) => axiosInstance().get(`/manager/users?page=${page}`);

export const getUser = (id) => axiosInstance().get(`/manager/users/${id}`);

export const createUser = (data) =>
  axiosInstance().post(`/manager/users`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateUser = (data) =>
  axiosInstance().put(`/manager/users`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteUser = (id) => axiosInstance().delete(`/manager/users/${id}`);
