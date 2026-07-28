const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
/**
 * Utility function to make API calls to the Spring Boot backend
 * @param {string} endpoint - The API endpoint (e.g., '/shipments')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // For 204 No Content or empty responses
    if (response.status === 204) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};
