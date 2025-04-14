import axiosInstance from '../utils/axios';

export const getAllGames = (page = 1) => axiosInstance().get(`/public/game?page=${page}`);

export const getGame = (id) => axiosInstance().get(`/public/game/${id}`);

export const createGame = (data) =>
  axiosInstance().post(`/manager/game`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateGame = (id, data) =>
  axiosInstance().put(`/manager/game/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteGame = (id) => axiosInstance().delete(`/manager/game/${id}`);

// RECORD

export const getAllRecords = (page = 1) => axiosInstance().get(`/manager/record?page=${page}`);

export const getRecord = (id) => axiosInstance().get(`/public/record/${id}`);

export const updateRecord = (data) => axiosInstance().put(`/manager/record`, data);
