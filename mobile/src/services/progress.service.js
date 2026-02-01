import api from './api';

const updateProgress = async (lessonId, completed = true) => {
  const response = await api.post('/progress', { 
    lesson_id: lessonId, 
    completed 
  });
  return response.data;
};

const getCourseProgress = async (courseId) => {
  const response = await api.get(`/progress/${courseId}`);
  return response.data;
};

export default {
  updateProgress,
  getCourseProgress,
};