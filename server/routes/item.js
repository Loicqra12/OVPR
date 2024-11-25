const express = require('express');
const router = express.Router();

// Route de test pour les objets
router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      type: 'perdu',
      title: 'Portefeuille noir',
      description: 'Perdu dans le métro',
      location: 'Paris',
      date: new Date(),
      status: 'active'
    }
  ]);
});

module.exports = router;
