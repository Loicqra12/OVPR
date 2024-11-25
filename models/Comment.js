const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['comment', 'status_update', 'alert'],
        default: 'comment'
    },
    status: {
        type: String,
        enum: ['active', 'stolen', 'lost', 'found', 'sold', 'damaged'],
        required: function() { return this.type === 'status_update'; }
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'admin_only'],
        default: 'public'
    },
    attachments: [{
        type: {
            type: String,
            enum: ['image', 'document', 'video']
        },
        url: String,
        description: String
    }],
    isResolved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index pour la recherche rapide
commentSchema.index({ item: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ type: 1 });

module.exports = mongoose.model('Comment', commentSchema);
