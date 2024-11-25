const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation pour la vérification d'un objet
const verifyItemValidation = [
    body('identifier').notEmpty().withMessage('L\'identifiant est requis'),
    body('type').optional().isIn(['serialNumber', 'vin']).withMessage('Type invalide')
];

// Validation pour la vérification par lot
const batchVerifyValidation = [
    body('identifiers').isArray().withMessage('La liste des identifiants est requise'),
    body('identifiers.*.value').notEmpty().withMessage('L\'identifiant est requis'),
    body('identifiers.*.type').isIn(['serialNumber', 'vin']).withMessage('Type invalide')
];

// Validation pour le transfert
const transferValidation = [
    body('itemId').notEmpty().withMessage('L\'ID de l\'objet est requis'),
    body('newOwnerId').notEmpty().withMessage('L\'ID du nouveau propriétaire est requis'),
    body('documents').isArray().withMessage('La liste des documents est requise'),
    body('documents.*.type').isIn(['receipt', 'contract', 'police_report', 'verification_certificate'])
        .withMessage('Type de document invalide'),
    body('documents.*.url').isURL().withMessage('URL invalide')
];

// Routes publiques
router.post('/verify', verifyItemValidation, verificationController.verifyItem);
router.post('/verify-batch', batchVerifyValidation, verificationController.batchVerify);
router.get('/history/:itemId', verificationController.getItemHistory);

// Routes protégées
router.post('/transfer', authMiddleware, transferValidation, verificationController.recordTransfer);

module.exports = router;
