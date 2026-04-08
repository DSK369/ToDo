import axios from 'axios';

const API = axios.create({
  baseURL: 'https://todo-lsd1.onrender.com/api',
  timeout: 15000,
});

export const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage;

export default API;
