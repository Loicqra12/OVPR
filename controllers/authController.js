const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/emailService');
const crypto = require('crypto');

// Création du token JWT
const createToken = (user) => {
    return jwt.sign(
        { 
            userId: user._id,
            email: user.email,
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, address } = req.body;

        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Cet email est déjà utilisé' 
            });
        }

        // Créer un nouvel utilisateur
        user = new User({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            address
        });

        // Créer un token de vérification d'email
        const verificationToken = user.createEmailVerificationToken();
        await user.save();

        // Envoyer l'email de vérification
        try {
            await emailService.sendVerificationEmail(user, verificationToken);
        } catch (error) {
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save({ validateBeforeSave: false });
            
            return res.status(500).json({
                status: 'error',
                message: 'Erreur lors de l\'envoi de l\'email de vérification'
            });
        }

        // Générer le token JWT
        const token = createToken(user);

        res.status(201).json({
            status: 'success',
            message: 'Utilisateur créé avec succès. Veuillez vérifier votre email.',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    preferences: user.preferences
                },
                token
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de l\'inscription',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur interne est survenue'
        });
    }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Email ou mot de passe incorrect' 
            });
        }

        // Vérifier si le compte est verrouillé
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const waitTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
            return res.status(403).json({
                status: 'error',
                message: `Compte temporairement bloqué. Réessayez dans ${waitTime} minutes`
            });
        }

        // Vérifier le mot de passe
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await user.incrementLoginAttempts();
            
            if (user.loginAttempts >= 5) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Compte bloqué pendant 1 heure suite à trop de tentatives'
                });
            }

            return res.status(400).json({ 
                status: 'error',
                message: 'Email ou mot de passe incorrect',
                attemptsLeft: 5 - user.loginAttempts
            });
        }

        // Réinitialiser les tentatives de connexion
        await user.resetLoginAttempts();

        // Mettre à jour la dernière connexion
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        // Générer le token JWT
        const token = createToken(user);

        res.json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    preferences: user.preferences,
                    stats: user.stats
                },
                token
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la connexion',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur interne est survenue'
        });
    }
};

// Vérification de l'email
exports.verifyEmail = async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Token invalide ou expiré'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.json({
            status: 'success',
            message: 'Email vérifié avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'email:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la vérification de l\'email'
        });
    }
};

// Demande de réinitialisation du mot de passe
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Aucun utilisateur trouvé avec cet email'
            });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        try {
            await emailService.sendPasswordResetEmail(user, resetToken);
            
            res.json({
                status: 'success',
                message: 'Email de réinitialisation envoyé'
            });
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                status: 'error',
                message: 'Erreur lors de l\'envoi de l\'email de réinitialisation'
            });
        }
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la demande de réinitialisation'
        });
    }
};

// Réinitialisation du mot de passe
exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Token invalide ou expiré'
            });
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        const token = createToken(user);

        res.json({
            status: 'success',
            message: 'Mot de passe réinitialisé avec succès',
            data: { token }
        });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la réinitialisation du mot de passe'
        });
    }
};

// Récupération du profil utilisateur
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    preferences: user.preferences,
                    stats: user.stats,
                    lastLogin: user.lastLogin
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération du profil'
        });
    }
};

// Mise à jour du profil
exports.updateProfile = async (req, res) => {
    try {
        const updates = {};
        const allowedUpdates = ['firstName', 'lastName', 'phoneNumber', 'address', 'preferences'];
        
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            status: 'success',
            message: 'Profil mis à jour avec succès',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    preferences: user.preferences
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour du profil',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur interne est survenue'
        });
    }
};

// Changement de mot de passe
exports.changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        const { currentPassword, newPassword } = req.body;

        // Vérifier l'ancien mot de passe
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                status: 'error',
                message: 'Mot de passe actuel incorrect'
            });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        await user.save();

        res.json({
            status: 'success',
            message: 'Mot de passe modifié avec succès'
        });
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors du changement de mot de passe',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur interne est survenue'
        });
    }
};

// Déconnexion
exports.logout = async (req, res) => {
    try {
        // Mettre à jour la dernière connexion
        await User.findByIdAndUpdate(req.user.id, {
            $set: { lastLogin: Date.now() }
        });

        res.json({
            status: 'success',
            message: 'Déconnexion réussie'
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la déconnexion'
        });
    }
};

// Rafraîchissement du token
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({
                status: 'error',
                message: 'Refresh token manquant'
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        const token = createToken(user);

        res.json({
            status: 'success',
            data: { token }
        });
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        res.status(401).json({
            status: 'error',
            message: 'Session expirée. Veuillez vous reconnecter'
        });
    }
};
