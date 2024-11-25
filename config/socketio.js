const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Middleware d'authentification pour Socket.IO
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    // Gestion des connexions
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user._id}`);
        
        // Rejoindre la room personnelle de l'utilisateur
        socket.join(socket.user._id.toString());

        // Écouter les déconnexions
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user._id}`);
        });

        // Écouter les changements de statut en ligne/hors ligne
        socket.on('status', (status) => {
            socket.user.online = status === 'online';
            socket.user.save();
            
            // Émettre le changement de statut aux utilisateurs concernés
            socket.broadcast.emit('userStatus', {
                userId: socket.user._id,
                status: status
            });
        });
    });

    return io;
}

// Fonction pour envoyer une notification à un utilisateur spécifique
async function sendNotificationToUser(userId, notification) {
    try {
        io.to(userId.toString()).emit('notification', notification);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
    }
}

// Fonction pour envoyer une notification à plusieurs utilisateurs
async function sendNotificationToUsers(userIds, notification) {
    try {
        userIds.forEach(userId => {
            io.to(userId.toString()).emit('notification', notification);
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi des notifications:', error);
    }
}

// Fonction pour envoyer une mise à jour de statut d'objet
async function sendItemStatusUpdate(itemId, status, affectedUsers) {
    try {
        affectedUsers.forEach(userId => {
            io.to(userId.toString()).emit('itemUpdate', {
                itemId,
                status,
                timestamp: new Date()
            });
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la mise à jour de statut:', error);
    }
}

module.exports = {
    initializeSocket,
    sendNotificationToUser,
    sendNotificationToUsers,
    sendItemStatusUpdate
};
