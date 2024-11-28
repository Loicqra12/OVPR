import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const nearbyItemsApi = {
  // Récupérer les objets à proximité avec filtres
  getNearbyItems: async (params) => {
    const { center, radius, filters } = params;
    try {
      const response = await axios.get(`${API_URL}/items/nearby`, {
        params: {
          lat: center.lat,
          lng: center.lng,
          radius,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sauvegarder une recherche
  saveSearch: async (searchData) => {
    try {
      const response = await axios.post(`${API_URL}/searches`, searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les recherches sauvegardées
  getSavedSearches: async () => {
    try {
      const response = await axios.get(`${API_URL}/searches`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les objets populaires
  getPopularItems: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/items/popular`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les objets récents
  getRecentItems: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/items/recent`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Partager un objet
  shareItem: async (itemId, platform) => {
    try {
      const response = await axios.post(`${API_URL}/items/${itemId}/share`, { platform });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour le statut d'un objet
  updateItemStatus: async (itemId, status) => {
    try {
      const response = await axios.patch(`${API_URL}/items/${itemId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default nearbyItemsApi;
