const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// Middleware d'authentification pour les routes admin
exports.authenticateAdmin = async (req, res, next) => {
  try {
    // Vérifier la présence du token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token d\'authentification manquant' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Vérifier que l'utilisateur existe et est un admin
    const admin = await User.findById(decoded.userId).select('-password -twoFactorSecret');
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Vérifier que le compte est actif
    if (admin.status !== 'active') {
      return res.status(403).json({ message: 'Compte administrateur désactivé' });
    }

    // Ajouter l'admin à la requête
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    console.error('Erreur d\'authentification admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware pour vérifier les permissions spécifiques
exports.checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin.permissions.includes(permission)) {
      return res.status(403).json({ 
        message: 'Vous n\'avez pas les permissions nécessaires pour cette action' 
      });
    }
    next();
  };
};

// Middleware pour la vérification 2FA
exports.require2FA = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const admin = await User.findById(userId);

    if (!admin || !admin.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA non configuré' });
    }

    // Vérifier si le code 2FA a déjà été validé pour cette session
    if (!req.session.verified2FA) {
      return res.status(403).json({ message: 'Validation 2FA requise' });
    }

    next();
  } catch (error) {
    console.error('Erreur de vérification 2FA:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware pour journaliser les actions admin
exports.logAdminAction = async (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    const adminAction = {
      admin: req.admin._id,
      action: req.method,
      path: req.originalUrl,
      params: req.params,
      query: req.query,
      body: req.body,
      status: res.statusCode,
      timestamp: new Date()
    };

    // Enregistrer l'action dans la base de données
    Activity.create({
      type: 'admin_action',
      user: req.admin._id,
      details: adminAction
    }).catch(error => {
      console.error('Erreur de journalisation admin:', error);
    });

    originalSend.call(this, data);
  };
  next();
};
