import axios from 'axios';
import { API_ENDPOINTS, getAuthHeader, handleApiError } from '../config/api';
import { mockItems } from '../data/mockItems';

// Service de gestion des annonces
class AnnouncementService {
  async getAnnouncements(filters = {}) {
    try {
      // Utiliser les données de test pour le développement
      let filteredItems = [...mockItems];

      // Appliquer les filtres si nécessaire
      if (filters.status) {
        filteredItems = filteredItems.filter(item => 
          item.status.toLowerCase() === filters.status.toLowerCase()
        );
      }
      if (filters.category) {
        filteredItems = filteredItems.filter(item => 
          item.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      }

      return filteredItems;
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
      throw error;
    }
  }

  async createAnnouncement(announcement) {
    try {
      // Simuler la création d'une annonce
      const newAnnouncement = {
        id: mockItems.length + 1,
        ...announcement,
        createdAt: new Date().toISOString()
      };
      
      // Dans un environnement de production, nous ferions un appel API ici
      // await axios.post(API_ENDPOINTS.ANNOUNCEMENTS.CREATE, announcement, {
      //   headers: getAuthHeader()
      // });

      return newAnnouncement;
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      throw error;
    }
  }

  async updateAnnouncement(id, updateData) {
    try {
      // Simuler la mise à jour d'une annonce
      const announcement = mockItems.find(item => item.id === id);
      if (!announcement) {
        throw new Error('Annonce non trouvée');
      }

      const updatedAnnouncement = {
        ...announcement,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      return updatedAnnouncement;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'annonce:', error);
      throw error;
    }
  }

  async deleteAnnouncement(id) {
    try {
      // Simuler la suppression d'une annonce
      const announcement = mockItems.find(item => item.id === id);
      if (!announcement) {
        throw new Error('Annonce non trouvée');
      }

      // Dans un environnement de production, nous ferions un appel API ici
      // await axios.delete(`${API_ENDPOINTS.ANNOUNCEMENTS.DELETE}/${id}`, {
      //   headers: getAuthHeader()
      // });

      return { success: true, message: 'Annonce supprimée avec succès' };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce:', error);
      throw error;
    }
  }

  async getAnnouncementsByStatus(status) {
    try {
      const response = await axios.get(API_ENDPOINTS.ANNOUNCEMENTS.BY_STATUS(status), {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces par statut:', error);
      throw handleApiError(error);
    }
  }

  async getAnnouncementByItemId(itemId) {
    try {
      const response = await axios.get(API_ENDPOINTS.ANNOUNCEMENTS.BY_ITEM(itemId), {
        headers: getAuthHeader()
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'annonce par itemId:', error);
      throw handleApiError(error);
    }
  }
}

export const announcementService = new AnnouncementService();
