import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.get('/auth/logout'),
};

// Excel API
export const excelAPI = {
  uploadFile: (formData) => api.post('/excel/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getFiles: () => api.get('/excel/files'),
  getFile: (fileId) => api.get(`/excel/files/${fileId}`),
  saveAnalysis: (analysisData) => api.post('/excel/analysis', analysisData),
  getAnalysisHistory: () => api.get('/excel/analysis'),
  deleteAnalysis: (analysisId) => api.delete(`/excel/analysis/${analysisId}`),
};

// Users API (admin only)
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUserStats: () => api.get('/users/stats'),
  updateUserStatus: (userId, status) => api.put(`/users/${userId}/status`, { isActive: status }),
};

export default api;