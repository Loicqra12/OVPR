const express = require('express');
const router = express.Router();

// Route de test pour les utilisateurs
router.get('/profile', (req, res) => {
  res.json({
    id: 1,
    username: 'test_user',
    email: 'test@example.com',
    profile: {
      firstName: 'Test',
      lastName: 'User',
      phone: '0123456789'
    }
  });
});

module.exports = router;
