import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Recherche avancée avec filtres
export const searchItems = async (searchParams) => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw error;
  }
};

// Recherche par numéro de série ou identifiant unique
export const searchBySerialNumber = async (serialNumber) => {
  try {
    const response = await axios.get(`${API_URL}/search/serial/${serialNumber}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche par numéro de série:', error);
    throw error;
  }
};

// Recherche géolocalisée
export const searchByLocation = async (lat, lng, radius) => {
  try {
    const response = await axios.get(`${API_URL}/search/nearby`, {
      params: { lat, lng, radius }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche par localisation:', error);
    throw error;
  }
};

// Sauvegarder une recherche
export const saveSearch = async (searchCriteria) => {
  try {
    const response = await axios.post(`${API_URL}/search/save`, searchCriteria);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la recherche:', error);
    throw error;
  }
};

// Récupérer les recherches sauvegardées
export const getSavedSearches = async () => {
  try {
    const response = await axios.get(`${API_URL}/search/saved`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des recherches sauvegardées:', error);
    throw error;
  }
};

// Supprimer une recherche sauvegardée
export const deleteSavedSearch = async (searchId) => {
  try {
    const response = await axios.delete(`${API_URL}/search/saved/${searchId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la recherche:', error);
    throw error;
  }
};

// Récupérer les recherches récentes
export const getRecentSearches = async () => {
  try {
    const response = await axios.get(`${API_URL}/search/recent`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des recherches récentes:', error);
    throw error;
  }
};

// Signaler un résultat de recherche
export const reportSearchResult = async (itemId, reportData) => {
  try {
    const response = await axios.post(`${API_URL}/search/report/${itemId}`, reportData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du signalement du résultat:', error);
    throw error;
  }
};

// Rechercher dans ses propres annonces
export const searchMyItems = async (searchParams) => {
  try {
    const response = await axios.get(`${API_URL}/search/my-items`, {
      params: searchParams
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche dans mes annonces:', error);
    throw error;
  }
};

// Obtenir les statistiques de recherche (admin)
export const getSearchStats = async (period = 'month') => {
  try {
    const response = await axios.get(`${API_URL}/search/stats`, {
      params: { period }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};
