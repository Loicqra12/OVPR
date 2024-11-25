const Item = require('../models/Item');

// Créer un nouveau bien
exports.createItem = async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            owner: req.user._id
        });
        await newItem.save();
        res.status(201).json({
            success: true,
            message: 'Bien enregistré avec succès',
            data: newItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de l\'enregistrement du bien',
            error: error.message
        });
    }
};

// Récupérer tous les biens d'un utilisateur
exports.getUserItems = async (req, res) => {
    try {
        const items = await Item.find({ owner: req.user._id });
        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la récupération des biens',
            error: error.message
        });
    }
};

// Mettre à jour le statut d'un bien
exports.updateItemStatus = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { status, notes } = req.body;

        const item = await Item.findOne({ _id: itemId, owner: req.user._id });
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Bien non trouvé'
            });
        }

        item.status = status;
        item.statusHistory.push({
            status,
            notes
        });

        await item.save();

        res.status(200).json({
            success: true,
            message: `Statut du bien mis à jour : ${status}`,
            data: item
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut',
            error: error.message
        });
    }
};

// Supprimer un bien
exports.deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findOneAndDelete({ _id: itemId, owner: req.user._id });
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Bien non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bien supprimé avec succès'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la suppression du bien',
            error: error.message
        });
    }
};
