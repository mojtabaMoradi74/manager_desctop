import axiosInstance from '../utils/axios';

export const createNewReportage = (data) => axiosInstance().post('/api/admin/reportage', data);

export const editReportage = (id, data) => axiosInstance().put(`/api/admin/reportage/${id}`, data);

export const getAllReportage = (page = 1, perPage = 12, isForeign = 0) =>
  axiosInstance().get(`/api/admin/reportage?page=${page}&&perPage=${perPage}&is_foreign=${isForeign}`);

export const getReportageData = (id) => axiosInstance().get(`/api/admin/reportage/${id}`);

export const deleteReportage = (id) => axiosInstance().delete(`/api/admin/reportage/${id}`);

export const getAllReportageOfNewsAgency = (id, isForeign = 0, page = 1, perPage = 12) =>
  axiosInstance().get(`/api/admin/reportage?news_id=${id}&is_foreign=${isForeign}&page=${page}&perPage=${perPage}`);

export const changeReportageActive = (data) => axiosInstance().post(`/api/admin/reportage_active`, data);

// Reportage VIP

export const getAllVIPReportage = (reportageId) => axiosInstance().get(`/api/admin/reportage_vip/${reportageId}`);

export const createVIPReportage = (data) => axiosInstance().post(`/api/admin/reportage_vip`, data);

export const editVIPReportage = (id, data) => axiosInstance().put(`/api/admin/reportage_vip/${id}`, data);

export const deleteVIPReportage = (id) => axiosInstance().delete(`/api/admin/reportage_vip/${id}`);

// Reportage Seller

export const getAllReportageSeller = (id) => axiosInstance().get(`/api/admin/reportage_seller`);

export const addSellerToReportage = (data) => axiosInstance().post(`/api/admin/reportage_seller`, data);

export const editSellerToReportage = (id, data) => axiosInstance().put(`/api/admin/reportage_seller/${id}`, data);

export const deleteSellerToReportage = (id) => axiosInstance().delete(`/api/admin/reportage_seller/${id}`);

// Publish

export const getAllPublishReportage = (page = 1, perPage = 10) =>
  axiosInstance().get(`/api/admin/publish?page=${page}&perPage=${perPage}`);

export const getPublishReportageData = (id) => axiosInstance().get(`/api/admin/publish/${id}`);

export const editPublishReportage = (id, data) => axiosInstance().put(`/api/admin/publish/${id}`, data);

export const statusCampaign = () => axiosInstance().get(`/api/status/campaign`);
