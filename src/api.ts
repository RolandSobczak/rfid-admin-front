import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/v1',
  timeout: 0,
});

export default api;
