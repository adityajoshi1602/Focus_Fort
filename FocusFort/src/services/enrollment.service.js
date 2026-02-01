import api from './api';

const enroll = async (courseId) => {
  const response = await api.post('/enrollments', { course_id: courseId });
  return response.data;
};

const getMyEnrollments = async () => {
  const response = await api.get('/enrollments/me');
  return response.data;
};

const checkStatus = async (courseId) => {
  const response = await api.get(`/enrollments/check/${courseId}`);
  return response.data;
};

export default {
  enroll,
  getMyEnrollments,
  checkStatus,
};