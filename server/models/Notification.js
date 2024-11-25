const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['match', 'update', 'resolved', 'system'],
    default: 'system',
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index pour améliorer les performances des requêtes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

// Méthode pour marquer comme lu
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  return this.save();
};

// Méthode statique pour créer une notification de correspondance
notificationSchema.statics.createMatchNotification = async function(userId, item) {
  return this.create({
    userId,
    title: 'Nouvelle correspondance trouvée !',
    message: `Un objet correspondant à "${item.title}" a été ${item.type === 'lost' ? 'trouvé' : 'déclaré perdu'}.`,
    type: 'match',
    relatedItem: item._id,
    metadata: {
      itemType: item.type,
      itemCategory: item.category,
      location: item.location,
    },
  });
};

// Méthode statique pour créer une notification de résolution
notificationSchema.statics.createResolvedNotification = async function(userId, item) {
  return this.create({
    userId,
    title: 'Objet récupéré !',
    message: `L'objet "${item.title}" a été marqué comme récupéré.`,
    type: 'resolved',
    relatedItem: item._id,
  });
};

// Méthode statique pour créer une notification de mise à jour
notificationSchema.statics.createUpdateNotification = async function(userId, item, updateType) {
  const messages = {
    location: 'La localisation a été mise à jour.',
    status: 'Le statut a été modifié.',
    details: 'Les détails ont été mis à jour.',
  };

  return this.create({
    userId,
    title: 'Mise à jour d\'un objet',
    message: `${item.title}: ${messages[updateType] || 'Des modifications ont été apportées.'}`,
    type: 'update',
    relatedItem: item._id,
    metadata: {
      updateType,
    },
  });
};

// Méthode statique pour obtenir les notifications non lues d'un utilisateur
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ userId, read: false });
};

// Méthode statique pour obtenir les notifications récentes d'un utilisateur
notificationSchema.statics.getRecent = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('relatedItem', 'title type category');
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
