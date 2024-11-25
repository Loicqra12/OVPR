const express = require('express');
const router = express.Router();

// Utilisateurs de test
const testUsers = [
  {
    id: 1,
    email: 'test@ovpr.fr',
    password: 'test123',
    name: 'Utilisateur Test',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Utilisateur+Test',
    createdAt: '2023-01-01',
    status: 'actif',
    itemsDeclared: 5,
    itemsFound: 2,
    stats: {
      itemsFound: 2,
      itemsReturned: 1,
      rating: 4.5
    },
    coordinates: {
      latitude: null,
      longitude: null
    }
  },
  {
    id: 2,
    email: 'admin@ovpr.fr',
    password: 'admin123',
    name: 'Administrateur',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin',
    createdAt: '2023-01-01',
    status: 'actif',
    itemsDeclared: 10,
    itemsFound: 8,
    stats: {
      itemsFound: 8,
      itemsReturned: 6,
      rating: 4.8
    },
    coordinates: {
      latitude: null,
      longitude: null
    }
  }
];

// Route de connexion
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Recherche de l'utilisateur
  const user = testUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });
  }

  // Simulation d'un token JWT
  const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString('base64');

  // On ne renvoie pas le mot de passe
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    token,
    user: userWithoutPassword
  });
});

// Route d'inscription
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  // Vérification si l'email existe déjà
  if (testUsers.some(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'Cet email est déjà utilisé'
    });
  }

  // Création d'un nouvel utilisateur
  const newUser = {
    id: testUsers.length + 1,
    email,
    password,
    name,
    role: 'user',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString(),
    status: 'actif',
    itemsDeclared: 0,
    itemsFound: 0,
    stats: {
      itemsFound: 0,
      itemsReturned: 0,
      rating: 0
    },
    coordinates: {
      latitude: null,
      longitude: null
    }
  };

  testUsers.push(newUser);

  // On ne renvoie pas le mot de passe
  const { password: _, ...userWithoutPassword } = newUser;

  res.json({
    success: true,
    message: 'Inscription réussie',
    user: userWithoutPassword
  });
});

// Route de profil
router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token manquant ou invalide'
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = testUsers.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
});

// Route pour mettre à jour les coordonnées
router.post('/update-coordinates', (req, res) => {
  const authHeader = req.headers.authorization;
  const { latitude, longitude } = req.body;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token manquant ou invalide'
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = testUsers.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Mise à jour des coordonnées
    user.coordinates = {
      latitude,
      longitude
    };

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
});

module.exports = router;
