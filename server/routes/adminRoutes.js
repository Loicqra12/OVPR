const express = require('express');
const router = express.Router();
const { authenticateAdmin, require2FA } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');
const statsController = require('../controllers/statsController');

// Routes d'authentification
router.post('/login', adminController.login);
router.post('/verify-2fa', adminController.verify2FA);
router.post('/refresh-token', adminController.refreshToken);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password', adminController.resetPassword);

// Routes protégées (nécessitent authentification)
router.use(authenticateAdmin);

// Statistiques et tableau de bord
router.get('/stats', statsController.getDashboardStats);
router.get('/stats/users', statsController.getUserStats);
router.get('/stats/announces', statsController.getAnnounceStats);
router.get('/stats/transactions', statsController.getTransactionStats);
router.get('/stats/geographic', statsController.getGeographicStats);

// Gestion des annonces
router.get('/announces', adminController.getAnnounces);
router.get('/announces/reported', adminController.getReportedAnnounces);
router.put('/announces/:id/status', adminController.updateAnnounceStatus);
router.delete('/announces/:id', adminController.deleteAnnounce);

// Gestion des utilisateurs
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Notifications et alertes
router.get('/alerts', adminController.getAlerts);
router.get('/notifications', adminController.getNotifications);
router.post('/notifications/send', adminController.sendNotification);

// Activités récentes
router.get('/recent-activity', adminController.getRecentActivity);

// Configuration
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// Export des données
router.get('/export/announces', adminController.exportAnnounces);
router.get('/export/users', adminController.exportUsers);
router.get('/export/transactions', adminController.exportTransactions);

module.exports = router;
