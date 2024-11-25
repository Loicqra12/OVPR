const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude et longitude requises' });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=fr`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors de la géolocalisation');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur de géocodage:', error);
    res.status(500).json({ error: 'Erreur lors de la géolocalisation' });
  }
});

module.exports = router;
