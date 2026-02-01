import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config/constants';

const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: CONFIG.HEADERS,
  timeout: 10000, // 10 second timeout
});

// Request Interceptor: Add Token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), we might want to logout logic here later
    if (error.response && error.response.status === 401) {
      console.log('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);

export const creatorApi = {
  apply: () => api.post('/creator/apply'),
  getApplications: () => api.get('/creator/applications'),
  review: (id, action) => api.post(`/creator/applications/${id}/review`, { action }),
};

export default api;