// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://exciting-tabbie-todolist-app-2e163783.koyeb.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    // Solo agregar token si estamos en el browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);
