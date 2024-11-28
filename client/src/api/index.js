import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur API:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      console.error('Erreur de connexion:', error.request);
      return Promise.reject({ message: 'Erreur de connexion au serveur' });
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// API Items
export const itemsApi = {
  // Créer un nouvel item
  create: async (itemData) => {
    const formData = new FormData();
    
    // Ajouter les données de base
    Object.keys(itemData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, JSON.stringify(itemData[key]));
      }
    });

    // Ajouter les images
    if (itemData.images) {
      itemData.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }

    const response = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Récupérer tous les items d'un utilisateur
  getUserItems: async () => {
    const response = await api.get('/items/user');
    return response.data;
  },

  // Mettre à jour le statut d'un item
  updateStatus: async (itemId, status) => {
    const response = await api.patch(`/items/${itemId}/status`, { status });
    return response.data;
  },

  // Récupérer un item par son ID
  getById: async (itemId) => {
    const response = await api.get(`/items/${itemId}`);
    return response.data;
  },

  // Mettre à jour un item
  update: async (itemId, itemData) => {
    const response = await api.put(`/items/${itemId}`, itemData);
    return response.data;
  },

  // Supprimer un item
  delete: async (itemId) => {
    const response = await api.delete(`/items/${itemId}`);
    return response.data;
  }
};

export default api;
