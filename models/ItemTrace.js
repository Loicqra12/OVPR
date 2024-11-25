const mongoose = require('mongoose');

const itemTraceSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    type: {
        type: String,
        enum: ['creation', 'purchase', 'sale', 'theft', 'loss', 'found', 'verification', 'transfer', 'police_check'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actorType: {
        type: String,
        enum: ['user', 'admin', 'police', 'system'],
        required: true
    },
    details: {
        previousOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        newOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        price: Number,
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: [Number],
            address: String
        },
        verificationResult: {
            status: {
                type: String,
                enum: ['clean', 'suspicious', 'stolen', 'reported']
            },
            notes: String,
            reportNumber: String
        },
        documents: [{
            type: {
                type: String,
                enum: ['receipt', 'contract', 'police_report', 'verification_certificate']
            },
            url: String,
            verified: Boolean
        }]
    },
    notes: String,
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index pour la recherche rapide
itemTraceSchema.index({ item: 1, date: -1 });
itemTraceSchema.index({ actor: 1 });
itemTraceSchema.index({ type: 1 });
itemTraceSchema.index({ 'details.verificationResult.status': 1 });

module.exports = mongoose.model('ItemTrace', itemTraceSchema);
