const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const itemController = require('../controllers/itemController');

// Routes protégées par authentification
router.use(auth);

// Créer un nouveau bien
router.post('/', itemController.createItem);

// Récupérer tous les biens de l'utilisateur
router.get('/my-items', itemController.getUserItems);

// Mettre à jour le statut d'un bien
router.patch('/:itemId/status', itemController.updateItemStatus);

// Supprimer un bien
router.delete('/:itemId', itemController.deleteItem);

module.exports = router;
