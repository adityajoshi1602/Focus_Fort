import api from './api';

const getFeed = async (page = 1, limit = 10) => {
  const response = await api.get(`/shorts?page=${page}&limit=${limit}`);
  return response.data;
};

export default {
  getFeed,
};