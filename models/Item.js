const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Smartphones',
            'Ordinateurs',
            'Tablettes',
            'Montres Connectées',
            'Caméras',
            'Consoles de Jeux',
            'Accessoires Audio',
            'Imprimantes',
            'Écrans',
            'Drones',
            'GPS',
            'Cyclomoteurs',
            'Autres Appareils'
        ]
    },
    value: {
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            required: true,
            default: 'FCFA'
        }
    },
    identifierType: {
        type: String,
        enum: ['imei', 'serial', 'vin'],
        required: true
    },
    identifierNumber: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        caption: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    purchaseDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'stolen', 'lost', 'found', 'sold', 'damaged'],
        default: 'active'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerHistory: [{
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        transferDate: {
            type: Date,
            default: Date.now
        },
        transferType: {
            type: String,
            enum: ['purchase', 'gift', 'inheritance', 'other']
        }
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
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
}, {
    timestamps: true
});

// Indexes pour la recherche rapide
itemSchema.index({ serialNumber: 1 });
itemSchema.index({ owner: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ category: 1 });

// Index géospatial pour les recherches de proximité
itemSchema.index({ location: '2dsphere' });

// Middleware pour mettre à jour updatedAt
itemSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Méthode pour vérifier si un utilisateur a accès à une information
itemSchema.methods.canAccessInfo = function(user, infoType) {
    const privacy = this.privacySettings[infoType];
    
    if (!user) return privacy === 'public';
    if (user.role === 'admin') return true;
    if (user._id.equals(this.owner)) return true;
    
    return privacy === 'public';
};

// Méthode pour filtrer les informations sensibles
itemSchema.methods.toPublicJSON = function(user) {
    const obj = this.toObject();
    
    if (!this.canAccessInfo(user, 'ownerInfo')) {
        delete obj.owner;
        obj.ownerHistory = obj.ownerHistory.map(history => ({
            transferDate: history.transferDate,
            transferType: history.transferType
        }));
    }
    
    if (!this.canAccessInfo(user, 'documentsAccess')) {
        delete obj.documents;
    }
    
    if (!this.canAccessInfo(user, 'historyAccess')) {
        delete obj.ownerHistory;
    }
    
    return obj;
};

module.exports = mongoose.model('Item', itemSchema);
