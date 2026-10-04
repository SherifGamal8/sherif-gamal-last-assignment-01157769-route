import axios from 'axios';

// Base axios instance for Route E-commerce API
const api = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1',
});

// Attach token to headers automatically if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export default api;
