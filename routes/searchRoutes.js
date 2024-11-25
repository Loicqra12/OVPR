const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const auth = require('../middleware/auth');

// Route de recherche rapide (accessible sans authentification)
router.get('/quick', searchController.quickSearch);

// Route de suggestions de recherche
router.get('/suggestions', searchController.searchSuggestions);

// Route de recherche avancée (nécessite une authentification)
router.get('/advanced', auth, searchController.advancedSearch);

module.exports = router;
