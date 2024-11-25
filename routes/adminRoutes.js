const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkRole, checkPermission } = require('../middleware/checkRole');
const User = require('../models/User');
const Item = require('../models/Item');
const Report = require('../models/Report');
const Role = require('../models/Role');

// Routes pour la gestion des utilisateurs
router.get('/users', auth, checkRole('admin', 'moderator'), async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
});

router.patch('/users/:id/role', auth, checkRole('admin'), async (req, res) => {
    try {
        const { roleId } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: roleId },
            { new: true }
        ).populate('role');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification du rôle' });
    }
});

// Routes pour la gestion des signalements
router.get('/reports', auth, checkRole('admin', 'moderator'), async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporter', '-password')
            .populate('item')
            .populate('moderatorNotes.moderator', '-password')
            .populate('resolution.moderator', '-password')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des signalements' });
    }
});

router.patch('/reports/:id', auth, checkRole('admin', 'moderator'), async (req, res) => {
    try {
        const { status, note, action } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Signalement non trouvé' });
        }

        report.status = status || report.status;
        
        if (note) {
            report.moderatorNotes.push({
                moderator: req.user.id,
                note: note
            });
        }

        if (action) {
            report.resolution = {
                action: action,
                note: note,
                timestamp: Date.now(),
                moderator: req.user.id
            };

            // Si l'action est une suppression, supprimer l'item
            if (action === 'deletion') {
                await Item.findByIdAndDelete(report.item);
            }
        }

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du signalement' });
    }
});

// Routes pour l'interface des autorités
router.get('/authority/items', auth, checkRole('authority'), async (req, res) => {
    try {
        const items = await Item.find({ status: { $in: ['stolen', 'lost'] } })
            .populate('owner', '-password')
            .sort({ updatedAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des objets' });
    }
});

router.get('/authority/user/:id', auth, checkRole('authority'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('role');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des informations utilisateur' });
    }
});

// Routes pour les statistiques
router.get('/statistics', auth, checkPermission('view_statistics'), async (req, res) => {
    try {
        const stats = {
            users: await User.countDocuments(),
            items: await Item.countDocuments(),
            reports: {
                total: await Report.countDocuments(),
                pending: await Report.countDocuments({ status: 'pending' }),
                resolved: await Report.countDocuments({ status: 'resolved' })
            },
            items_by_status: {
                active: await Item.countDocuments({ status: 'active' }),
                stolen: await Item.countDocuments({ status: 'stolen' }),
                lost: await Item.countDocuments({ status: 'lost' }),
                found: await Item.countDocuments({ status: 'found' })
            }
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
});

module.exports = router;
