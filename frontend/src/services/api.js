import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para injetar o token JWT no cabeçalho de toda requisição
api.interceptors.request.use(async config => {
  const token = localStorage.getItem('@Helpdesk:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;