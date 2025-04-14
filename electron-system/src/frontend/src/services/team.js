import axiosInstance from '../utils/axios';

// Profile

export const getAllTeams = (page = 1) => axiosInstance().get(`/public/team?page=${page}`);

export const getTeam = (id) => axiosInstance().get(`/public/team/${id}`);

export const createTeam = (data) =>
  axiosInstance().post(`/manager/team`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateTeam = (data) =>
  axiosInstance().put(`/manager/team`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteTeam = (id) => axiosInstance().delete(`/manager/team/${id}`);
