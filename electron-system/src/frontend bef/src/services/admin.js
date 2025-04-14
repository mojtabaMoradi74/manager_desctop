import axiosInstance from '../utils/axios';

// Profile

export const adminProfile = () => axiosInstance().get('/manager/me');
export const clientProfile = () => axiosInstance().get('/client/profile');

// Admin

export const createAdmin = (data) => axiosInstance().post('/admin/list', data);

export const editAdmin = (id, data) => axiosInstance().put(`/admin/list`, data);

export const getAllAdmin = (page = 1, perPage = 10) => axiosInstance().get(`/admin/list?page=${page}`);

export const getAdminDetail = (id) => axiosInstance().get(`/admin/list/${id}`);

export const deleteAdmin = (id) => axiosInstance().delete(`/admin/list/${id}`);

// Role

export const getAllRole = (page = 1, perPage = 10) =>
  axiosInstance().get(`/admin/role?page=${page}&perPage=${perPage}`);

export const getRoleDetail = (id) => axiosInstance().get(`/admin/role/${id}`);

export const createRole = (data) => axiosInstance().post(`/admin/role`, data);

export const editRole = (id, data) => axiosInstance().put(`/admin/role/${id}`, data);

// Permission

export const getAllPermission = (page = 1, perPage = 10) =>
  axiosInstance().get(`/admin/permission?page=${page}&perPage=${perPage}`);
