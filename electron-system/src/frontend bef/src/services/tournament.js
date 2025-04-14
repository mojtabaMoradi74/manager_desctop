import axiosInstance from '../utils/axios';

// Profile

export const getAllTournaments = (page = 1, limit = 10) =>
  axiosInstance().get(`/public/tournaments?page=${page}&limit=${limit}`);

export const getTournament = (id) => axiosInstance().get(`/public/tournament/${id}`);

export const createTournament = (data) =>
  axiosInstance().post(`/manager/tournament`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateTournament = (data) =>
  axiosInstance().put(`/manager/tournament`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteTournament = (id) => axiosInstance().delete(`/manager/tournament/${id}`);
