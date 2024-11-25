const ItemVerificationService = require('../services/itemVerificationService');
const { validationResult } = require('express-validator');

exports.verifyItem = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { identifier, type = 'serialNumber' } = req.body;
        const result = await ItemVerificationService.verifyItem(identifier, type);

        res.json({
            status: 'success',
            data: result
        });
    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la vérification de l\'objet'
        });
    }
};

exports.batchVerify = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { identifiers } = req.body;
        const results = await ItemVerificationService.batchVerifyItems(identifiers);

        res.json({
            status: 'success',
            data: results
        });
    } catch (error) {
        console.error('Erreur lors de la vérification par lot:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la vérification par lot'
        });
    }
};

exports.getItemHistory = async (req, res) => {
    try {
        const { itemId } = req.params;
        const traces = await ItemVerificationService.getItemHistory(itemId);

        res.json({
            status: 'success',
            data: traces
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération de l\'historique'
        });
    }
};

exports.recordTransfer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { itemId, newOwnerId, documents } = req.body;
        const previousOwnerId = req.user.userId; // L'utilisateur connecté est l'ancien propriétaire

        const trace = await ItemVerificationService.recordTransfer(
            itemId,
            previousOwnerId,
            newOwnerId,
            documents
        );

        res.json({
            status: 'success',
            message: 'Transfert enregistré avec succès',
            data: trace
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du transfert:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de l\'enregistrement du transfert'
        });
    }
};
