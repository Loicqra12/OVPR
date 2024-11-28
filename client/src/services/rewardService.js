import api from '../api';

// Définition des types de badges
export const BADGE_TYPES = {
  HELPER: 'helper',
  FINDER: 'finder',
  TRUSTED: 'trusted',
  COMMUNITY: 'community',
  EXPERT: 'expert'
};

// Configuration des badges
export const BADGES_CONFIG = {
  [BADGE_TYPES.HELPER]: {
    name: 'Bon Samaritain',
    description: 'A aidé à retrouver 5 objets perdus',
    icon: '🤝',
    requirement: 5
  },
  [BADGE_TYPES.FINDER]: {
    name: 'Œil de Lynx',
    description: 'A trouvé et déclaré 10 objets',
    icon: '👁️',
    requirement: 10
  },
  [BADGE_TYPES.TRUSTED]: {
    name: 'Digne de Confiance',
    description: 'A reçu 20 évaluations positives',
    icon: '⭐',
    requirement: 20
  },
  [BADGE_TYPES.COMMUNITY]: {
    name: 'Pilier de la Communauté',
    description: 'Actif depuis 3 mois avec 30 interactions',
    icon: '🏛️',
    requirement: 30
  },
  [BADGE_TYPES.EXPERT]: {
    name: 'Expert OVPR',
    description: 'A obtenu tous les autres badges',
    icon: '🏆',
    requirement: 4
  }
};

// Points accordés pour différentes actions
export const POINTS_CONFIG = {
  DECLARE_FOUND: 10,
  ITEM_RETURNED: 25,
  POSITIVE_FEEDBACK: 5,
  VERIFIED_RETURN: 15,
  SUCCESSFUL_MATCH: 20
};

class RewardService {
  async getUserRewards(userId) {
    try {
      const response = await api.get(`/users/${userId}/rewards`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des récompenses:', error);
      throw error;
    }
  }

  async awardPoints(userId, actionType, itemId) {
    try {
      const points = POINTS_CONFIG[actionType] || 0;
      const response = await api.post(`/users/${userId}/points`, {
        points,
        actionType,
        itemId
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'attribution des points:', error);
      throw error;
    }
  }

  async checkAndAwardBadges(userId) {
    try {
      const response = await api.post(`/users/${userId}/check-badges`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification des badges:', error);
      throw error;
    }
  }

  async getLeaderboard(period = 'month', limit = 10) {
    try {
      const response = await api.get('/leaderboard', {
        params: { period, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du classement:', error);
      throw error;
    }
  }

  calculateLevel(points) {
    // Chaque niveau nécessite 100 points de plus que le précédent
    const level = Math.floor((-1 + Math.sqrt(1 + 8 * points / 100)) / 2) + 1;
    const pointsForNextLevel = (level * (level + 1) * 50) - points;
    
    return {
      currentLevel: level,
      pointsForNextLevel,
      totalPoints: points
    };
  }

  getBadgeProgress(stats, badgeType) {
    const badge = BADGES_CONFIG[badgeType];
    if (!badge) return null;

    let progress;
    switch (badgeType) {
      case BADGE_TYPES.HELPER:
        progress = (stats.itemsHelped || 0) / badge.requirement;
        break;
      case BADGE_TYPES.FINDER:
        progress = (stats.itemsFound || 0) / badge.requirement;
        break;
      case BADGE_TYPES.TRUSTED:
        progress = (stats.positiveRatings || 0) / badge.requirement;
        break;
      case BADGE_TYPES.COMMUNITY:
        progress = (stats.totalInteractions || 0) / badge.requirement;
        break;
      case BADGE_TYPES.EXPERT:
        progress = (stats.totalBadges || 0) / badge.requirement;
        break;
      default:
        progress = 0;
    }

    return {
      ...badge,
      progress: Math.min(progress, 1),
      current: stats[badgeType] || 0,
      isComplete: progress >= 1
    };
  }
}

export default new RewardService();
