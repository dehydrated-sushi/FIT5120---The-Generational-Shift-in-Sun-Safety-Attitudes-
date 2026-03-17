import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

/**
 * Pre-configured axios instance pointing at the Flask backend.
 * Base URL comes from the VITE_API_BASE_URL env variable.
 *
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
