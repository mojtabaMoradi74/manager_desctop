import axiosInstance from '../utils/axios';

export const createSpecialContent = (data) => axiosInstance().post('/api/admin/special-content', data);

export const createSpecialContentPlaylist = (data) => axiosInstance().post('/api/admin/special-content-playlist', data);
