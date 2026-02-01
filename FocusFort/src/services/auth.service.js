import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

const signup = async (fullName, email, password) => {
  const response = await api.post('/auth/signup', {
    full_name: fullName,
    email,
    password,
  });
  return response.data;
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default {
  login,
  signup,
  getMe,
};