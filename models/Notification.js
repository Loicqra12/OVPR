const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['match', 'status_update', 'alert', 'info'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    matchedItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    actionUrl: {
        type: String
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index pour améliorer les performances des requêtes
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // Expire après 30 jours

module.exports = mongoose.model('Notification', notificationSchema);
