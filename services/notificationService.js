const Notification = require('../models/Notification');
const Item = require('../models/Item');
const socketIO = require('../config/socket');
const emailService = require('./emailService');

class NotificationService {
    static async createNotification(data) {
        try {
            const notification = new Notification(data);
            await notification.save();

            // Envoi de la notification en temps réel via Socket.IO
            const io = socketIO.getIO();
            io.to(`user_${data.recipient}`).emit('newNotification', notification);

            // Envoi d'un email si la priorité est haute
            if (data.priority === 'high') {
                const user = await require('../models/User').findById(data.recipient);
                if (user && user.notificationPreferences?.email) {
                    await emailService.sendMatchNotification(user, data.relatedItem);
                }
            }

            return notification;
        } catch (error) {
            console.error('Erreur lors de la création de la notification:', error);
            throw error;
        }
    }

    static async getUserNotifications(userId, options = { status: 'unread', category: null }) {
        try {
            const query = {
                recipient: userId,
                ...(options.status ? { status: options.status } : {}),
                ...(options.category ? { category: options.category } : {})
            };

            return await Notification.find(query)
                .sort({ createdAt: -1 })
                .populate('relatedItem')
                .populate('matchedItem')
                .limit(options.limit || 50);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications:', error);
            throw error;
        }
    }

    static async markAsRead(notificationId, userId) {
        try {
            const notification = await Notification.findOneAndUpdate(
                { _id: notificationId, recipient: userId },
                { status: 'read' },
                { new: true }
            );

            if (!notification) {
                throw new Error('Notification non trouvée ou accès non autorisé');
            }

            // Mise à jour en temps réel
            const io = socketIO.getIO();
            io.to(`user_${userId}`).emit('notificationRead', notificationId);

            return notification;
        } catch (error) {
            console.error('Erreur lors du marquage de la notification comme lue:', error);
            throw error;
        }
    }

    static async markAllAsRead(userId, category = null) {
        try {
            const query = {
                recipient: userId,
                status: 'unread',
                ...(category ? { category } : {})
            };

            const result = await Notification.updateMany(query, { status: 'read' });

            // Mise à jour en temps réel
            const io = socketIO.getIO();
            io.to(`user_${userId}`).emit('allNotificationsRead', { category });

            return result;
        } catch (error) {
            console.error('Erreur lors du marquage des notifications comme lues:', error);
            throw error;
        }
    }

    static async checkForMatches(item) {
        try {
            let matchQuery = {};
            
            // Construction de la requête en fonction du type d'objet
            if (item.type === 'vehicle') {
                matchQuery = {
                    'vehicleDetails.vin': item.vehicleDetails.vin
                };
            } else if (item.serialNumber) {
                matchQuery = {
                    serialNumber: item.serialNumber
                };
            } else {
                // Recherche par caractéristiques similaires
                matchQuery = {
                    category: item.category,
                    $or: [
                        { brand: item.brand },
                        { model: item.model },
                        { color: item.color }
                    ],
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 30)) // 30 derniers jours
                    }
                };
            }

            // Recherche des correspondances
            const matches = await Item.find({
                ...matchQuery,
                _id: { $ne: item._id },
                status: { $in: ['stolen', 'lost', 'forgotten'] }
            }).populate('owner');

            // Création des notifications pour chaque correspondance
            for (const match of matches) {
                // Notification pour le propriétaire de l'objet correspondant
                await this.createNotification({
                    recipient: match.owner._id,
                    type: 'match',
                    category: 'match',
                    title: 'Correspondance trouvée !',
                    message: `Un objet correspondant à votre ${match.name} a été signalé.`,
                    relatedItem: match._id,
                    matchedItem: item._id,
                    priority: 'high',
                    actionUrl: `/dashboard/items/${match._id}`
                });

                // Notification pour le propriétaire de l'objet actuel
                await this.createNotification({
                    recipient: item.owner,
                    type: 'match',
                    category: 'match',
                    title: 'Attention : Objet potentiellement signalé',
                    message: `Cet objet correspond à un objet ${match.status}.`,
                    relatedItem: item._id,
                    matchedItem: match._id,
                    priority: 'high',
                    actionUrl: `/dashboard/items/${item._id}`
                });
            }

            return matches;
        } catch (error) {
            console.error('Erreur lors de la vérification des correspondances:', error);
            throw error;
        }
    }

    static async createStatusUpdateNotification(item, oldStatus, newStatus) {
        try {
            const statusMessages = {
                found: 'a été retrouvé',
                lost: 'a été perdu',
                stolen: 'a été volé',
                returned: 'a été rendu à son propriétaire',
                archived: 'a été archivé'
            };

            const notification = await this.createNotification({
                recipient: item.owner,
                type: 'status',
                category: 'status',
                title: 'Mise à jour du statut',
                message: `Votre objet "${item.name}" ${statusMessages[newStatus] || 'a changé de statut'}.`,
                relatedItem: item._id,
                priority: 'medium',
                actionUrl: `/dashboard/items/${item._id}`
            });

            return notification;
        } catch (error) {
            console.error('Erreur lors de la création de la notification de mise à jour:', error);
            throw error;
        }
    }

    static async deleteNotification(notificationId, userId) {
        try {
            const notification = await Notification.findOneAndDelete({
                _id: notificationId,
                recipient: userId
            });

            if (!notification) {
                throw new Error('Notification non trouvée ou accès non autorisé');
            }

            // Mise à jour en temps réel
            const io = socketIO.getIO();
            io.to(`user_${userId}`).emit('notificationDeleted', notificationId);

            return notification;
        } catch (error) {
            console.error('Erreur lors de la suppression de la notification:', error);
            throw error;
        }
    }

    static async getNotificationStats(userId) {
        try {
            const stats = await Notification.aggregate([
                { $match: { recipient: userId } },
                {
                    $group: {
                        _id: {
                            category: '$category',
                            status: '$status'
                        },
                        count: { $sum: 1 }
                    }
                }
            ]);

            return stats.reduce((acc, curr) => {
                const category = curr._id.category || 'other';
                const status = curr._id.status;
                if (!acc[category]) acc[category] = { unread: 0, read: 0 };
                acc[category][status] = curr.count;
                return acc;
            }, {});
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    }
}

module.exports = NotificationService;
