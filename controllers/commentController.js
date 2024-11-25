const Comment = require('../models/Comment');
const Item = require('../models/Item');
const NotificationService = require('../services/notificationService');
const { validationResult } = require('express-validator');

// Créer un nouveau commentaire
exports.createComment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { itemId, content, type, status, visibility, attachments } = req.body;

        // Vérifier si l'objet existe
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                status: 'error',
                message: 'Objet non trouvé'
            });
        }

        // Créer le commentaire
        const comment = new Comment({
            item: itemId,
            author: req.user.userId,
            content,
            type,
            status,
            visibility,
            attachments
        });

        await comment.save();

        // Si c'est une mise à jour de statut, mettre à jour l'objet
        if (type === 'status_update') {
            item.status = status;
            await item.save();
        }

        // Créer une notification
        await NotificationService.createCommentNotification(item, comment);

        res.status(201).json({
            status: 'success',
            data: {
                comment: await Comment.findById(comment._id)
                    .populate('author', 'firstName lastName role')
            }
        });
    } catch (error) {
        console.error('Erreur lors de la création du commentaire:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la création du commentaire'
        });
    }
};

// Récupérer les commentaires d'un objet
exports.getItemComments = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const userRole = req.user ? req.user.role : 'public';

        // Construire la requête en fonction du rôle
        let visibilityQuery = { visibility: 'public' };
        if (userRole === 'admin') {
            visibilityQuery = {}; // Les admins voient tout
        } else if (userRole === 'user') {
            visibilityQuery = { visibility: { $ne: 'admin_only' } };
        }

        const comments = await Comment.find({
            item: itemId,
            ...visibilityQuery
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('author', 'firstName lastName role');

        const total = await Comment.countDocuments({
            item: itemId,
            ...visibilityQuery
        });

        res.json({
            status: 'success',
            data: {
                comments,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(total / limit),
                    totalComments: total
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des commentaires'
        });
    }
};

// Mettre à jour un commentaire
exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content, visibility, isResolved } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                status: 'error',
                message: 'Commentaire non trouvé'
            });
        }

        // Vérifier les permissions
        if (comment.author.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Non autorisé à modifier ce commentaire'
            });
        }

        // Mettre à jour le commentaire
        comment.content = content || comment.content;
        comment.visibility = visibility || comment.visibility;
        comment.isResolved = isResolved !== undefined ? isResolved : comment.isResolved;

        await comment.save();

        res.json({
            status: 'success',
            data: {
                comment: await Comment.findById(comment._id)
                    .populate('author', 'firstName lastName role')
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du commentaire:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour du commentaire'
        });
    }
};

// Supprimer un commentaire
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                status: 'error',
                message: 'Commentaire non trouvé'
            });
        }

        // Vérifier les permissions
        if (comment.author.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Non autorisé à supprimer ce commentaire'
            });
        }

        await comment.remove();

        res.json({
            status: 'success',
            message: 'Commentaire supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression du commentaire'
        });
    }
};
