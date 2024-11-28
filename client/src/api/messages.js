import axios from 'axios';
import { API_BASE_URL } from '../config';

const messagesApi = {
  // Récupérer toutes les conversations d'un utilisateur
  getConversations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/conversations`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error);
      throw error;
    }
  },

  // Récupérer les messages d'une conversation
  getMessages: async (conversationId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }
  },

  // Envoyer un nouveau message
  sendMessage: async (conversationId, message) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/messages/${conversationId}`, message);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  },

  // Créer une nouvelle conversation
  createConversation: async (recipientId, itemId, initialMessage) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/messages/conversations`, {
        recipientId,
        itemId,
        message: initialMessage,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      throw error;
    }
  },

  // Marquer les messages comme lus
  markAsRead: async (conversationId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/messages/${conversationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage des messages comme lus:', error);
      throw error;
    }
  },

  // Bloquer un utilisateur
  blockUser: async (userId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/messages/block/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du blocage de l\'utilisateur:', error);
      throw error;
    }
  },

  // Signaler un message
  reportMessage: async (messageId, reason) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/messages/${messageId}/report`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du signalement du message:', error);
      throw error;
    }
  },

  // Supprimer une conversation
  deleteConversation: async (conversationId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/messages/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la conversation:', error);
      throw error;
    }
  },

  // Rechercher dans les messages
  searchMessages: async (query) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/search`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche dans les messages:', error);
      throw error;
    }
  },

  // Mettre à jour les préférences de notification
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/messages/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      throw error;
    }
  },
};

export default messagesApi;
