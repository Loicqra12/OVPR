const NotificationService = require('../services/notificationService');
const User = require('../models/User');

// Obtenir toutes les notifications d'un utilisateur
exports.getUserNotifications = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const notifications = await NotificationService.getUserNotifications(
            req.user._id,
            { status, skip, limit: parseInt(limit) }
        );

        const totalNotifications = await Notification.countDocuments({
            recipient: req.user._id,
            ...(status ? { status } : {})
        });

        res.json({
            notifications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalNotifications / limit),
            totalNotifications
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
    }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await NotificationService.markAsRead(notificationId);
        
        if (!notification) {
            return res.status(404).json({ error: 'Notification non trouvée' });
        }

        // Émettre un événement WebSocket pour mettre à jour le statut en temps réel
        req.io.to(req.user._id.toString()).emit('notificationUpdate', {
            type: 'STATUS_UPDATE',
            notificationId,
            status: 'read'
        });

        res.json(notification);
    } catch (error) {
        console.error('Erreur lors du marquage de la notification:', error);
        res.status(500).json({ error: 'Erreur lors du marquage de la notification' });
    }
};

// Marquer toutes les notifications comme lues
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, status: 'unread' },
            { status: 'read' }
        );

        // Émettre un événement WebSocket pour mettre à jour tous les statuts
        req.io.to(req.user._id.toString()).emit('notificationUpdate', {
            type: 'MARK_ALL_READ'
        });

        res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
    } catch (error) {
        console.error('Erreur lors du marquage des notifications:', error);
        res.status(500).json({ error: 'Erreur lors du marquage des notifications' });
    }
};

// Supprimer une notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification non trouvée' });
        }

        // Émettre un événement WebSocket pour la suppression
        req.io.to(req.user._id.toString()).emit('notificationUpdate', {
            type: 'DELETE',
            notificationId
        });

        res.json({ message: 'Notification supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la notification' });
    }
};

// Mettre à jour les préférences de notification
exports.updatePreferences = async (req, res) => {
    try {
        const { email, sms, push, frequency } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                'notificationPreferences.email': email,
                'notificationPreferences.sms': sms,
                'notificationPreferences.push': push,
                'notificationPreferences.frequency': frequency
            },
            { new: true }
        );

        res.json(user.notificationPreferences);
    } catch (error) {
        console.error('Erreur lors de la mise à jour des préférences:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour des préférences' });
    }
};

// Obtenir le nombre de notifications non lues
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            status: 'unread'
        });

        res.json({ count });
    } catch (error) {
        console.error('Erreur lors du comptage des notifications:', error);
        res.status(500).json({ error: 'Erreur lors du comptage des notifications' });
    }
};
