const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
        if (!token) {
            return res.status(401).json({ message: 'Token manquant' });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalide' });
        }
        return res.status(500).json({ message: 'Erreur d\'authentification' });
    }
};

module.exports = authMiddleware;
