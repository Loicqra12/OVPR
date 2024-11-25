const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        // Vérifier si le header Authorization existe
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Token d\'authentification manquant' 
            });
        }

        // Récupérer le token du header Authorization
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : authHeader;
        
        if (!token) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Token d\'authentification invalide' 
            });
        }

        try {
            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Vérifier si l'utilisateur existe toujours
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ 
                    status: 'error',
                    message: 'L\'utilisateur n\'existe plus' 
                });
            }

            // Vérifier si l'utilisateur est actif
            if (!user.isActive) {
                return res.status(401).json({ 
                    status: 'error',
                    message: 'Compte désactivé' 
                });
            }

            // Vérifier si l'email est vérifié
            if (!user.isEmailVerified) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'Email non vérifié' 
                });
            }

            // Ajouter l'utilisateur à la requête
            req.user = {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            };
            
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    status: 'error',
                    message: 'Token expiré' 
                });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    status: 'error',
                    message: 'Token invalide' 
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur interne du serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
