// Middleware de vérification des rôles
exports.checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentification requise'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Accès non autorisé'
            });
        }

        next();
    };
};

// Middleware de vérification de propriété
exports.checkOwnership = (model) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params.id;
            const resource = await model.findById(resourceId);

            if (!resource) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ressource non trouvée'
                });
            }

            // Vérifier si l'utilisateur est le propriétaire
            if (resource.userId.toString() !== req.user.id.toString() && 
                req.user.role !== 'admin') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Accès non autorisé'
                });
            }

            // Ajouter la ressource à la requête pour éviter une nouvelle requête
            req.resource = resource;
            next();
        } catch (error) {
            console.error('Erreur de vérification de propriété:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erreur interne du serveur',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    };
};

// Middleware pour les actions administratives
exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Accès réservé aux administrateurs'
        });
    }
    next();
};

// Middleware pour les actions de modération
exports.isModerator = (req, res, next) => {
    if (!req.user || !['admin', 'moderator'].includes(req.user.role)) {
        return res.status(403).json({
            status: 'error',
            message: 'Accès réservé aux modérateurs'
        });
    }
    next();
};
