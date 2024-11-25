const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const WebSocket = require('ws');

// Configuration WebSocket
let wss;
const setupWebSocket = (server) => {
  wss = new WebSocket.Server({ server, path: '/notifications' });

  wss.on('connection', (ws, req) => {
    // Authentifier la connexion WebSocket (à implémenter)
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('error', console.error);
  });

  // Ping pour maintenir les connexions actives
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
};

// Fonction utilitaire pour envoyer des notifications
const broadcastNotification = (userId, notification) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.userId === userId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
};

// Obtenir toutes les notifications de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.getRecent(req.user._id);
    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir le nombre de notifications non lues
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user._id);
    res.json({ count });
  } catch (error) {
    console.error('Erreur lors du comptage des notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Marquer une notification comme lue
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    await notification.markAsRead();
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Marquer toutes les notifications comme lues
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer toutes les notifications lues
router.delete('/read/all', auth, async (req, res) => {
  try {
    await Notification.deleteMany({
      userId: req.user._id,
      read: true,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = { router, setupWebSocket, broadcastNotification };
