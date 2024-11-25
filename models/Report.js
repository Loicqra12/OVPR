const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['stolen', 'fraud', 'inappropriate', 'duplicate', 'other']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'investigating', 'resolved', 'rejected'],
        default: 'pending'
    },
    description: {
        type: String,
        required: true
    },
    evidence: [{
        type: String, // URLs des fichiers téléchargés
        required: false
    }],
    moderatorNotes: [{
        moderator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        note: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    resolution: {
        action: {
            type: String,
            enum: ['none', 'warning', 'suspension', 'deletion'],
            default: 'none'
        },
        note: String,
        timestamp: Date,
        moderator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index pour améliorer les performances des requêtes
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ item: 1, status: 1 });

// Middleware pour mettre à jour la date de modification
reportSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Report', reportSchema);
