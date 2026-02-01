import api from './api';

const toggleLike = async (type, id) => {
  // type = 'short' | 'course' | 'lesson'
  const response = await api.post('/likes', { type, id });
  return response.data;
};

export default {
  toggleLike,
};  