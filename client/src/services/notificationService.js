import api from '../api';

// Types de notifications
export const NOTIFICATION_TYPES = {
  CHALLENGE_COMPLETED: 'challenge_completed',
  BADGE_EARNED: 'badge_earned',
  LEVEL_UP: 'level_up',
  EVENT_STARTED: 'event_started',
  EVENT_ENDING: 'event_ending',
  REWARD_AVAILABLE: 'reward_available'
};

// Configuration des notifications
export const NOTIFICATIONS_CONFIG = {
  [NOTIFICATION_TYPES.CHALLENGE_COMPLETED]: {
    title: 'Défi Complété',
    template: 'Vous avez complété le défi "{challengeName}" !',
    icon: '🎯',
    color: 'success.main',
    autoHide: true,
    duration: 5000
  },
  [NOTIFICATION_TYPES.BADGE_EARNED]: {
    title: 'Nouveau Badge',
    template: 'Félicitations ! Vous avez obtenu le badge "{badgeName}" !',
    icon: '🏆',
    color: 'warning.main',
    autoHide: false
  },
  [NOTIFICATION_TYPES.LEVEL_UP]: {
    title: 'Niveau Supérieur',
    template: 'Vous avez atteint le niveau {level} !',
    icon: '⭐',
    color: 'primary.main',
    autoHide: true,
    duration: 7000
  },
  [NOTIFICATION_TYPES.EVENT_STARTED]: {
    title: 'Nouvel Événement',
    template: 'L\'événement "{eventName}" vient de commencer !',
    icon: '🎉',
    color: 'info.main',
    autoHide: false
  },
  [NOTIFICATION_TYPES.EVENT_ENDING]: {
    title: 'Événement Bientôt Terminé',
    template: 'L\'événement "{eventName}" se termine dans {timeLeft} !',
    icon: '⏰',
    color: 'warning.main',
    autoHide: true,
    duration: 10000
  },
  [NOTIFICATION_TYPES.REWARD_AVAILABLE]: {
    title: 'Récompense Disponible',
    template: 'Une récompense vous attend pour "{challengeName}" !',
    icon: '🎁',
    color: 'success.main',
    autoHide: true,
    duration: 5000
  }
};

class NotificationService {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(notification) {
    this.listeners.forEach(callback => callback(notification));
  }

  async getNotifications(userId) {
    try {
      const response = await api.get(`/users/${userId}/notifications`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  async markAsRead(userId, notificationId) {
    try {
      const response = await api.post(`/users/${userId}/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      throw error;
    }
  }

  async deleteNotification(userId, notificationId) {
    try {
      await api.delete(`/users/${userId}/notifications/${notificationId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }

  createNotification(type, data) {
    const config = NOTIFICATIONS_CONFIG[type];
    if (!config) return null;

    let message = config.template;
    Object.keys(data).forEach(key => {
      message = message.replace(`{${key}}`, data[key]);
    });

    return {
      id: Date.now(),
      type,
      title: config.title,
      message,
      icon: config.icon,
      color: config.color,
      autoHide: config.autoHide,
      duration: config.duration,
      timestamp: new Date(),
      read: false
    };
  }

  // Méthodes utilitaires pour créer des notifications spécifiques
  notifyChallengeCompleted(challengeName) {
    const notification = this.createNotification(
      NOTIFICATION_TYPES.CHALLENGE_COMPLETED,
      { challengeName }
    );
    this.notify(notification);
    return notification;
  }

  notifyBadgeEarned(badgeName) {
    const notification = this.createNotification(
      NOTIFICATION_TYPES.BADGE_EARNED,
      { badgeName }
    );
    this.notify(notification);
    return notification;
  }

  notifyLevelUp(level) {
    const notification = this.createNotification(
      NOTIFICATION_TYPES.LEVEL_UP,
      { level }
    );
    this.notify(notification);
    return notification;
  }

  notifyEventStarted(eventName) {
    const notification = this.createNotification(
      NOTIFICATION_TYPES.EVENT_STARTED,
      { eventName }
    );
    this.notify(notification);
    return notification;
  }

  notifyEventEnding(eventName, timeLeft) {
    const notification = this.createNotification(
      NOTIFICATION_TYPES.EVENT_ENDING,
      { eventName, timeLeft }
    );
    this.notify(notification);
    return notification;
  }

  notifyRewardAvailable(challengeName) {
    const notification = this.createNotification(
      NOTIFICATION_TYPES.REWARD_AVAILABLE,
      { challengeName }
    );
    this.notify(notification);
    return notification;
  }
}

export default new NotificationService();
