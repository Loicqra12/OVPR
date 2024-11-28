// Configuration de l'application
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Configuration des notifications
export const NOTIFICATION_CONFIG = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Configuration des messages
export const MESSAGE_CONFIG = {
  maxAttachmentSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  maxMessageLength: 1000,
};

// Configuration de la carte
export const MAP_CONFIG = {
  defaultCenter: {
    lat: 48.8566,
    lng: 2.3522,
  },
  defaultZoom: 13,
};

// Configuration de la recherche
export const SEARCH_CONFIG = {
  maxSearchRadius: 50, // km
  maxResults: 100,
  defaultSearchRadius: 5, // km
};

// Configuration de l'authentification
export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiration: 24 * 60 * 60 * 1000, // 24 heures
};

// Configuration des timeouts
export const TIMEOUT_CONFIG = {
  apiTimeout: 30000, // 30 secondes
  uploadTimeout: 300000, // 5 minutes
};

// Configuration des limites
export const LIMITS_CONFIG = {
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  maxImagesPerItem: 5,
  maxSavedSearches: 10,
  maxActiveAnnouncements: 5,
};

// Configuration des formats de date
export const DATE_CONFIG = {
  format: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
  locale: 'fr',
};
