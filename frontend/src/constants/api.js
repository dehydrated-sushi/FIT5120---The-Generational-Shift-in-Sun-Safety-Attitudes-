/**
 * API configuration constants.
 * Base URL is read from environment variables — never hardcoded.
 */

/** @type {string} Base URL for the Flask backend API */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/** @type {Object} API endpoint paths */
export const ENDPOINTS = {
  CLOTHING: '/clothing/',
  UV: '/uv/',
  CANCER: '/cancer/',
  AUTH: '/auth/',
  AUTH_LOGIN: '/auth/login',
  HEALTH: '/health',
  LOCATIONS: '/locations/',
};
