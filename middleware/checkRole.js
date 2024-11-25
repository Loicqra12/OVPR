const User = require('../models/User');

const checkRole = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Non authentifié' });
            }

            const user = await User.findById(req.user.id).populate('role');
            
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            if (!roles.includes(user.role.name)) {
                return res.status(403).json({ 
                    message: 'Accès non autorisé. Rôle requis : ' + roles.join(' ou ')
                });
            }

            // Ajouter le rôle de l'utilisateur à l'objet req pour une utilisation ultérieure
            req.userRole = user.role;
            next();
        } catch (error) {
            console.error('Erreur lors de la vérification du rôle:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    };
};

const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Non authentifié' });
            }

            const user = await User.findById(req.user.id).populate('role');
            
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            if (!user.role.permissions.includes(permission)) {
                return res.status(403).json({ 
                    message: 'Permission insuffisante'
                });
            }

            next();
        } catch (error) {
            console.error('Erreur lors de la vérification des permissions:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    };
};

module.exports = {
    checkRole,
    checkPermission
};
