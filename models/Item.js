const mongoose = require('mongoose');
const CommentSchema = require('./schemas/CommentSchema');

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    alt: String,
    order: {
        type: Number,
        default: 0
    }
});

const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['FOUND', 'LOST', 'CLAIMED', 'REJECTED', 'IN_STORAGE', 'IN_TRANSIT', 'PENDING_VERIFICATION', 'VERIFIED']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    comment: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const itemSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
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
        ],
        index: true
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
    images: [imageSchema],
    purchaseDate: {
        type: Date
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        }
    },
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    status: {
        type: String,
        enum: ['FOUND', 'LOST', 'CLAIMED', 'REJECTED', 'IN_STORAGE', 'IN_TRANSIT', 'PENDING_VERIFICATION', 'VERIFIED'],
        default: 'PENDING_VERIFICATION',
        index: true
    },
    statusHistory: [statusHistorySchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerHistory: [{
        owner: {
            type: mongoose.Schema.Types.ObjectId,
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
    comments: [CommentSchema],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
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

// Index composite pour les recherches courantes
itemSchema.index({ status: 1, category: 1, createdAt: -1 });
itemSchema.index({ tags: 1, status: 1 });

// Middleware pour mettre à jour updatedAt
itemSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Middleware pour trier les images par ordre
itemSchema.pre('save', function(next) {
    if (this.images && this.images.length > 0) {
        this.images.sort((a, b) => a.order - b.order);
    }
    next();
});

// Méthode pour ajouter une entrée dans l'historique des statuts
itemSchema.methods.addStatusHistory = function(status, user, comment = '') {
    this.status = status;
    this.statusHistory.push({
        status,
        user,
        comment,
        timestamp: new Date()
    });
};

// Méthode pour obtenir une version publique de l'objet
itemSchema.methods.toPublicJSON = function(currentUser) {
    const obj = this.toObject();
    
    // Suppression des informations sensibles
    delete obj.__v;
    
    // Ajout d'informations supplémentaires pour l'utilisateur connecté
    if (currentUser) {
        obj.isOwner = currentUser._id.equals(this.owner);
        obj.canEdit = obj.isOwner || currentUser.roles.includes('admin');
    }

    return obj;
};

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

// Méthode pour filtrer les informations sensibles
itemSchema.methods.filterSensitiveInfo = function(userRole, userId) {
    const item = this.toObject();

    // Administrateurs : accès complet
    if (userRole === 'admin') return item;

    // Propriétaire : accès à ses propres informations
    const isOwner = userId && userId.toString() === item.owner.toString();
    if (isOwner) return item;

    // Autres utilisateurs : filtrage selon les paramètres de confidentialité
    if (item.privacySettings.ownerInfo !== 'public') {
        delete item.owner;
    }

    if (item.privacySettings.documents !== 'public') {
        item.documents = item.documents.filter(doc => doc.isPublic);
    }

    // Filtrer les commentaires selon la visibilité
    item.comments = item.comments.filter(comment => comment.visibility === 'public');

    return item;
};

// Méthode pour ajouter un commentaire
itemSchema.methods.addComment = function(comment) {
    this.comments.push(comment);
    this.lastUpdated = new Date();
    return this.save();
};

// Méthode pour mettre à jour le statut
itemSchema.methods.updateStatus = function(status, userId, comment) {
    this.status = status;
    if (comment) {
        this.comments.push({
            content: comment,
            type: 'status_update',
            status: status,
            author: userId,
            visibility: 'public'
        });
    }
    this.lastUpdated = new Date();
    return this.save();
};

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
