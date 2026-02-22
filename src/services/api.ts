import axios from 'axios';
import type { Resume } from '../store/resumeStore';

const API_BASE_URL = import.meta.env.VITE_APP_RENDER_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => localStorage.removeItem('token'),
};

// Resume services
export const resumeService = {
  createResume: (data: Partial<Resume>) => api.post('/resumes', data),
  getResumes: () => api.get('/resumes'),
  getResume: (id: string) => api.get(`/resumes/${id}`),
  updateResume: (id: string, data: Partial<Resume>) => api.put(`/resumes/${id}`, data),
  deleteResume: (id: string) => api.delete(`/resumes/${id}`),
  downloadResume: (id: string, format: 'pdf' | 'docx') =>
    api.get(`/resumes/${id}/download?format=${format}`, {
      responseType: 'blob',
    }),
};

export default api;
