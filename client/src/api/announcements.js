import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Récupérer toutes les annonces
export const getAllAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_URL}/announcements`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    throw error;
  }
};

// Récupérer une annonce par son ID
export const getAnnouncementById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annonce:', error);
    throw error;
  }
};

// Créer une nouvelle annonce
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await axios.post(`${API_URL}/announcements`, announcementData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error);
    throw error;
  }
};

// Mettre à jour une annonce
export const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await axios.put(`${API_URL}/announcements/${id}`, announcementData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'annonce:', error);
    throw error;
  }
};

// Supprimer une annonce
export const deleteAnnouncement = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'annonce:', error);
    throw error;
  }
};

// Signaler une annonce
export const reportAnnouncement = async (id, reportData) => {
  try {
    const response = await axios.post(`${API_URL}/announcements/${id}/report`, reportData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du signalement de l\'annonce:', error);
    throw error;
  }
};

// Marquer une annonce comme favorite
export const toggleFavorite = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/announcements/${id}/favorite`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la modification des favoris:', error);
    throw error;
  }
};

// Marquer un objet comme retrouvé
export const markAsFound = async (id, foundData) => {
  try {
    const response = await axios.post(`${API_URL}/announcements/${id}/found`, foundData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du marquage de l\'objet comme retrouvé:', error);
    throw error;
  }
};

// Rechercher des annonces
export const searchAnnouncements = async (searchParams) => {
  try {
    const response = await axios.get(`${API_URL}/announcements/search`, { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'annonces:', error);
    throw error;
  }
};

// Récupérer les annonces favorites d'un utilisateur
export const getUserFavorites = async () => {
  try {
    const response = await axios.get(`${API_URL}/announcements/favorites`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    throw error;
  }
};
