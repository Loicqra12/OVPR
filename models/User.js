const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    postalCode: {
        type: String,
        trim: true,
        match: [/^\d{5}$/, 'Le code postal doit contenir 5 chiffres']
    },
    country: {
        type: String,
        default: 'France',
        trim: true
    }
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
        minlength: [2, 'Le prénom doit contenir au moins 2 caractères']
    },
    lastName: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caractères']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
        select: false,
        validate: {
            validator: function(password) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(password);
            },
            message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        }
    },
    phoneNumber: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
        trim: true,
        match: [/^(\+33|0)[1-9](\d{2}){4}$/, 'Le numéro de téléphone n\'est pas valide']
    },
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin'],
        default: 'user'
    },
    address: addressSchema,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    preferences: {
        language: {
            type: String,
            enum: ['fr', 'en'],
            default: 'fr'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: false
            }
        },
        radius: {
            type: Number,
            default: 10,
            min: 1,
            max: 100
        }
    },
    stats: {
        itemsFound: {
            type: Number,
            default: 0
        },
        itemsLost: {
            type: Number,
            default: 0
        },
        successfulMatches: {
            type: Number,
            default: 0
        },
        reputation: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index pour la recherche
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ 'address.postalCode': 1 });

// Virtuals
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Middleware pour hacher le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour créer un token de vérification d'email
userSchema.methods.createEmailVerificationToken = function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
        
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
    
    return verificationToken;
};

// Méthode pour créer un token de réinitialisation de mot de passe
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
        
    this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 heure
    
    return resetToken;
};

// Méthode pour incrémenter les tentatives de connexion
userSchema.methods.incrementLoginAttempts = async function() {
    // Si le compte est déjà verrouillé et que le délai n'est pas expiré
    if (this.lockUntil && this.lockUntil > Date.now()) {
        return;
    }

    // Incrémenter les tentatives
    this.loginAttempts += 1;

    // Verrouiller le compte après 5 tentatives
    if (this.loginAttempts >= 5) {
        this.lockUntil = Date.now() + 60 * 60 * 1000; // 1 heure
    }

    return this.save();
};

// Méthode pour réinitialiser les tentatives de connexion
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $set: {
            loginAttempts: 0,
            lockUntil: undefined
        }
    });
};

// Méthode pour mettre à jour les statistiques
userSchema.methods.updateStats = async function(type) {
    const updates = {};
    if (type === 'found') updates['stats.itemsFound'] = this.stats.itemsFound + 1;
    if (type === 'lost') updates['stats.itemsLost'] = this.stats.itemsLost + 1;
    if (type === 'match') {
        updates['stats.successfulMatches'] = this.stats.successfulMatches + 1;
        updates['stats.reputation'] = this.stats.reputation + 10;
    }
    
    return this.updateOne({ $set: updates });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
