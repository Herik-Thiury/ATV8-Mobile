import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sermon-motivator-unworthy.ngrok-free.dev' 
});

export default api;