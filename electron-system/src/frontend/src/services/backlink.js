import axiosInstance from '../utils/axios';

export const createNewBacklink = (data) => axiosInstance().post('/api/admin/backlink', data);

export const editBacklink = (id, data) => axiosInstance().put(`/api/admin/backlink/${id}`, data);

export const getAllBacklink = (page = 1, perPage = 12) =>
  axiosInstance().get(`/api/admin/backlink?page=${page}&&perPage=${perPage}`);

export const getBacklinkData = (id) => axiosInstance().get(`/api/admin/backlink/${id}`);

export const deleteBacklink = (id) => axiosInstance().delete(`/api/admin/backlink/${id}`);

export const getAllBacklinkOfNewsAgency = (id, page = 1, perPage = 10) =>
  axiosInstance().get(`/api/admin/backlink?news_id=${id}&page=${page}&perPage=${perPage}`);

export const changeBacklinkActive = (data) => axiosInstance().post(`/api/admin/backlink_active`, data);

// Backlink VIP

export const getAllVIPBacklink = (backlinkId) => axiosInstance().get(`/api/admin/backlink_vip/${backlinkId}`);

export const createVIPBacklink = (data) => axiosInstance().post(`/api/admin/backlink_vip`, data);

export const editVIPBacklink = (id, data) => axiosInstance().put(`/api/admin/backlink_vip/${id}`, data);

export const deleteVIPBacklink = (id) => axiosInstance().delete(`/api/admin/backlink_vip/${id}`);

// Backlink Discount

export const getAllGeneralDiscountBacklink = (backlinkId) =>
  axiosInstance().get(`/api/admin/backlink_discount?backlink_id=${backlinkId}`);

export const createGeneralDiscountBacklink = (data) => axiosInstance().post(`/api/admin/backlink_discount`, data);

export const editGeneralDiscountBacklink = (id, data) =>
  axiosInstance().put(`/api/admin/backlink_discount/${id}`, data);

export const deleteGeneralDiscountBacklink = (id) => axiosInstance().delete(`/api/admin/backlink_discount/${id}`);

// Backlink Seller

export const getAllBacklinkSeller = (id) => axiosInstance().get(`/api/admin/backlink_seller`);

export const addSellerToBacklink = (data) => axiosInstance().post(`/api/admin/backlink_seller`, data);

export const editSellerToBacklink = (id, data) => axiosInstance().put(`/api/admin/backlink_seller/${id}`, data);

export const deleteSellerToBacklink = (id, data) =>
  axiosInstance().delete(`/api/admin/backlink_seller/${id}`, {
    maxBodyLength: Infinity,
    data,
  });

// Publish

export const getAllPublishBacklink = (page = 1, perPage = 10) =>
  axiosInstance().get(`/api/admin/backlink_publish?page=${page}&perPage=${perPage}`);

export const getPublishBacklinkData = (id) => axiosInstance().get(`/api/admin/backlink_publish/${id}`);

export const editPublishBacklink = (id, data) => axiosInstance().put(`/api/admin/backlink_publish/${id}`, data);

export const statusCampaign = () => axiosInstance().get(`/api/status/campaign`);

// Insert

export const getAllInsert = (page = 1, perPage = 12) =>
  axiosInstance().get(`/api/admin/insert?page=${page}&perPage=${perPage}`);

export const getInsert = (id) => axiosInstance().get(`/api/admin/insert/${id}`);

export const createNewInsert = (data) => axiosInstance().post(`/api/admin/insert`, data);

export const editInsert = (id, data) => axiosInstance().put(`/api/admin/insert/${id}`, data);

export const deleteInsert = (id) => axiosInstance().delete(`/api/admin/insert/${id}`);

// Release Place

export const getAllReleasePlace = (page = 1, perPage = 12) =>
  axiosInstance().get(`/api/admin/release?page=${page}&perPage=${perPage}`);

export const getReleasePlace = (id) => axiosInstance().get(`/api/admin/release/${id}`);

export const createNewReleasePlace = (data) => axiosInstance().post(`/api/admin/release`, data);

export const editReleasePlace = (id, data) => axiosInstance().put(`/api/admin/release/${id}`, data);

export const deleteReleasePlace = (id) => axiosInstance().delete(`/api/admin/release/${id}`);
