// src/services/auth.service.js
import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  
  // Call this when the user clicks "Generate API Key" in Settings
  generateApiKey: () => api.post('/auth/generate-key'),
  
  getProfile: () => api.get('/auth/profile'),
};