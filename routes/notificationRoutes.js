const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Récupérer toutes les notifications de l'utilisateur avec pagination
router.get('/', auth, notificationController.getUserNotifications);

// Obtenir le nombre de notifications non lues
router.get('/unread-count', auth, notificationController.getUnreadCount);

// Marquer une notification comme lue
router.patch('/:notificationId/read', auth, notificationController.markAsRead);

// Marquer toutes les notifications comme lues
router.patch('/read-all', auth, notificationController.markAllAsRead);

// Supprimer une notification
router.delete('/:notificationId', auth, notificationController.deleteNotification);

// Mettre à jour les préférences de notification
router.put('/preferences', auth, notificationController.updatePreferences);

module.exports = router;
