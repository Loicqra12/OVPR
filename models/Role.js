const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['admin', 'moderator', 'user', 'authority']
    },
    permissions: [{
        type: String,
        enum: [
            'manage_users',
            'manage_items',
            'validate_items',
            'access_user_details',
            'moderate_reports',
            'view_statistics',
            'manage_roles',
            'access_authority_interface'
        ]
    }],
    description: {
        type: String,
        required: true
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

// Middleware pour mettre à jour la date de modification
roleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Role', roleSchema);
