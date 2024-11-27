const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminCredentials = require('../config/adminCredentials');

// Route de connexion admin
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Vérification des identifiants
  if (email === adminCredentials.email && password === adminCredentials.password) {
    // Création du token JWT
    const token = jwt.sign(
      {
        id: 'admin',
        email: adminCredentials.email,
        role: adminCredentials.role,
        name: adminCredentials.name,
      },
      'votre_secret_jwt',
      { expiresIn: '24h' }
    );

    // Envoi de la réponse
    res.json({
      success: true,
      token,
      user: {
        email: adminCredentials.email,
        role: adminCredentials.role,
        name: adminCredentials.name,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect',
    });
  }
});

// Middleware de vérification du token admin
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token non fourni',
    });
  }

  try {
    const decoded = jwt.verify(token, 'votre_secret_jwt');
    if (decoded.role !== 'admin') {
      throw new Error('Non autorisé');
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
    });
  }
};

// Route de vérification du token
router.get('/verify', verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    user: {
      email: req.user.email,
      role: req.user.role,
      name: req.user.name,
    },
  });
});

module.exports = {
  router,
  verifyAdminToken,
};
