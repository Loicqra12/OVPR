const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');
const auth = require('../middleware/auth');

// Enregistrer une nouvelle recherche
router.post('/', auth, async (req, res) => {
  try {
    const { query, filters, results, location } = req.body;
    const searchHistory = new SearchHistory({
      userId: req.user.id,
      query,
      filters,
      results,
      location,
    });
    await searchHistory.save();
    res.status(201).json(searchHistory);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la recherche:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir l'historique des recherches récentes de l'utilisateur
router.get('/recent', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recentSearches = await SearchHistory.getRecentSearches(req.user.id, limit);
    res.json(recentSearches);
  } catch (error) {
    console.error('Erreur lors de la récupération des recherches récentes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les recherches populaires
router.get('/popular', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const limit = parseInt(req.query.limit) || 10;
    const popularSearches = await SearchHistory.getPopularSearches(days, limit);
    res.json(popularSearches);
  } catch (error) {
    console.error('Erreur lors de la récupération des recherches populaires:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir des suggestions de recherche similaires
router.get('/similar', async (req, res) => {
  try {
    const { query } = req.query;
    const limit = parseInt(req.query.limit) || 5;
    if (!query) {
      return res.status(400).json({ message: 'Le paramètre query est requis' });
    }
    const similarSearches = await SearchHistory.getSimilarSearches(query, limit);
    res.json(similarSearches);
  } catch (error) {
    console.error('Erreur lors de la récupération des recherches similaires:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les recherches à proximité
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const maxDistance = parseInt(req.query.maxDistance) || 5000; // en mètres
    const limit = parseInt(req.query.limit) || 5;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Les coordonnées sont requises' });
    }

    const coordinates = [parseFloat(lng), parseFloat(lat)];
    const nearbySearches = await SearchHistory.getNearbySearches(coordinates, maxDistance, limit);
    res.json(nearbySearches);
  } catch (error) {
    console.error('Erreur lors de la récupération des recherches à proximité:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une recherche de l'historique
router.delete('/:id', auth, async (req, res) => {
  try {
    const searchHistory = await SearchHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!searchHistory) {
      return res.status(404).json({ message: 'Recherche non trouvée' });
    }

    res.json({ message: 'Recherche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la recherche:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Effacer tout l'historique de recherche d'un utilisateur
router.delete('/', auth, async (req, res) => {
  try {
    await SearchHistory.deleteMany({ userId: req.user.id });
    res.json({ message: 'Historique de recherche effacé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'historique:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
