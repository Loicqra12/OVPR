import api from '../api';

// Types de défis
export const CHALLENGE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  EVENT: 'event'
};

// Configuration des défis
export const CHALLENGES_CONFIG = {
  DECLARE_ITEMS: {
    id: 'declare_items',
    title: 'Déclarateur Actif',
    description: 'Déclarez {target} objets trouvés',
    points: 50,
    icon: '📝'
  },
  HELP_USERS: {
    id: 'help_users',
    title: 'Main Secourable',
    description: 'Aidez {target} utilisateurs à retrouver leurs objets',
    points: 75,
    icon: '🤝'
  },
  VERIFY_ITEMS: {
    id: 'verify_items',
    title: 'Vérificateur Expert',
    description: 'Vérifiez {target} objets dans votre zone',
    points: 40,
    icon: '✅'
  },
  QUICK_RETURN: {
    id: 'quick_return',
    title: 'Retour Express',
    description: 'Retournez un objet en moins de 24h',
    points: 100,
    icon: '⚡'
  },
  STREAK_LOGIN: {
    id: 'streak_login',
    title: 'Fidèle au Poste',
    description: 'Connectez-vous {target} jours consécutifs',
    points: 30,
    icon: '🔥'
  }
};

// Configuration des événements spéciaux
export const EVENTS_CONFIG = {
  SUMMER_CLEANUP: {
    id: 'summer_cleanup',
    title: 'Grand Nettoyage d\'Été',
    description: 'Participez à l\'événement de nettoyage estival',
    startDate: '2024-07-01',
    endDate: '2024-07-31',
    challenges: ['declare_items', 'verify_items'],
    bonusPoints: 200
  },
  BACK_TO_SCHOOL: {
    id: 'back_to_school',
    title: 'Rentrée Solidaire',
    description: 'Aidez les étudiants à retrouver leurs affaires',
    startDate: '2024-09-01',
    endDate: '2024-09-15',
    challenges: ['help_users', 'quick_return'],
    bonusPoints: 150
  }
};

class ChallengeService {
  async getDailyChallenges(userId) {
    try {
      const response = await api.get(`/users/${userId}/challenges/daily`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des défis quotidiens:', error);
      throw error;
    }
  }

  async getWeeklyChallenges(userId) {
    try {
      const response = await api.get(`/users/${userId}/challenges/weekly`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des défis hebdomadaires:', error);
      throw error;
    }
  }

  async getActiveEvents() {
    try {
      const response = await api.get('/events/active');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des événements actifs:', error);
      throw error;
    }
  }

  async claimReward(userId, challengeId) {
    try {
      const response = await api.post(`/users/${userId}/challenges/${challengeId}/claim`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la réclamation de la récompense:', error);
      throw error;
    }
  }

  async trackProgress(userId, challengeId, action) {
    try {
      const response = await api.post(`/users/${userId}/challenges/${challengeId}/progress`, {
        action
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
      throw error;
    }
  }

  generateDailyTargets() {
    // Génère des objectifs aléatoires pour les défis quotidiens
    return {
      declare_items: Math.floor(Math.random() * 3) + 1,
      help_users: Math.floor(Math.random() * 2) + 1,
      verify_items: Math.floor(Math.random() * 4) + 2
    };
  }

  generateWeeklyTargets() {
    // Génère des objectifs plus ambitieux pour les défis hebdomadaires
    return {
      declare_items: Math.floor(Math.random() * 5) + 5,
      help_users: Math.floor(Math.random() * 3) + 3,
      verify_items: Math.floor(Math.random() * 6) + 5,
      streak_login: 5
    };
  }

  isEventActive(event) {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return now >= startDate && now <= endDate;
  }

  formatChallenge(challenge, target) {
    return {
      ...challenge,
      description: challenge.description.replace('{target}', target)
    };
  }
}

export default new ChallengeService();
