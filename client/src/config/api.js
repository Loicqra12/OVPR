const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/auth/profile/update`,
  },
  
  // Announcement endpoints
  ANNOUNCEMENTS: {
    BASE: `${API_BASE_URL}/announcements`,
    GET_ALL: `${API_BASE_URL}/announcements`,
    CREATE: `${API_BASE_URL}/announcements`,
    UPDATE: (id) => `${API_BASE_URL}/announcements/${id}`,
    DELETE: (id) => `${API_BASE_URL}/announcements/${id}`,
    BY_STATUS: (status) => `${API_BASE_URL}/announcements/status/${status}`,
    BY_ITEM: (itemId) => `${API_BASE_URL}/announcements/item/${itemId}`,
    SEARCH: `${API_BASE_URL}/announcements/search`,
  },
  
  // Items endpoints
  ITEMS: {
    BASE: `${API_BASE_URL}/items`,
    GET_ALL: `${API_BASE_URL}/items`,
    CREATE: `${API_BASE_URL}/items`,
    UPDATE: (id) => `${API_BASE_URL}/items/${id}`,
    DELETE: (id) => `${API_BASE_URL}/items/${id}`,
    BY_USER: (userId) => `${API_BASE_URL}/items/user/${userId}`,
  },
  
  // Users endpoints
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    GET_ALL: `${API_BASE_URL}/users`,
    GET_ONE: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/users/${id}`,
  },
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleApiError = (error) => {
  if (error.response) {
    // La requête a été faite et le serveur a répondu avec un code d'erreur
    return {
      success: false,
      error: error.response.data.message || 'Une erreur est survenue',
      status: error.response.status,
    };
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    return {
      success: false,
      error: 'Impossible de contacter le serveur',
      status: 503,
    };
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    return {
      success: false,
      error: error.message || 'Une erreur est survenue',
      status: 500,
    };
  }
};
