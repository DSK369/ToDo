import axios from 'axios';

const API = axios.create({
  baseURL: 'https://todo-lsd1.onrender.com/api',
});

export default API;