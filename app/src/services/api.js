// src/services/api.js
import axios from 'axios';

const api = axios.create({
  // Use the Gateway Port (4000) as the base URL
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach API Key before sending
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('user_api_key');
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }
  return config;
});

// Response Interceptor: Handle Global Errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;