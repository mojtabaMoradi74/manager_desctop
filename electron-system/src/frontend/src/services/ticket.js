import axiosInstance from '../utils/axios';

export const getAllTickets = (page = 1, perPage = 10) =>
  axiosInstance().get(`/manager/ticket?page=${page}&limit=${perPage}`);

export const getTicketData = (id) => axiosInstance().get(`/manager/ticket/${id}`);

export const closeTicket = (data) => axiosInstance().post(`/manager/ticket`, data);

export const deleteTicket = (id) => axiosInstance().delete(`/manager/ticket/${id}`);

export const newMessage = (id, data) => axiosInstance().put(`/manager/reply`, data);

// DEPARTMENTS

export const getAllDepartments = (page = 1, perPage = 10) =>
  axiosInstance().get(`/manager/department?page=${page}&limit=${perPage}`);

export const getDepartmentData = (id) => axiosInstance().get(`/manager/department/${id}`);

export const createDepartment = (data) => axiosInstance().post(`/manager/department`, data);

export const updateDepartment = (data) => axiosInstance().put(`/manager/department`, data);

export const deleteDepartment = (id) => axiosInstance().delete(`/manager/department/${id}`);
