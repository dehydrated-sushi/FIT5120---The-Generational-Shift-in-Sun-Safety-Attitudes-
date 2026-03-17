import api from './api';
import { ENDPOINTS } from '../constants/api';

/**
 * Fetch real-time UV alert data for a given location.
 *
 * Calls GET /api/uv/?lat={lat}&lon={lon} on the Flask backend
 * and returns the UV index, risk level, and plain-language message.
 *
 * @param {number} lat - Latitude of the location.
 * @param {number} lon - Longitude of the location.
 * @returns {Promise<Object>} Resolves with { uv_index, level, message, location, recorded_at }.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export async function getUVAlert(lat, lon) {
  const response = await api.get(ENDPOINTS.UV, {
    params: { lat, lon },
  });
  return response.data;
}

/**
 * Fetch clothing recommendations for a given UV index.
 *
 * Calls GET /api/clothing/?uv_index={uvIndex} on the Flask backend
 * and returns the response data containing matching clothing rules.
 *
 * @param {number} uvIndex - The current UV index value.
 * @returns {Promise<Object>} Resolves with { uv_index, recommendations }.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export async function getClothingRecommendation(uvIndex) {
  const response = await api.get(ENDPOINTS.CLOTHING, {
    params: { uv_index: uvIndex },
  });
  return response.data;
}
