// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://exciting-tabbie-todolist-app-2e163783.koyeb.app',
  headers: {
    'Content-Type': 'application/json',
  },
});
