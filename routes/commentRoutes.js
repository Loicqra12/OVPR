const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation pour la création de commentaire
const createCommentValidation = [
    body('itemId').notEmpty().withMessage('ID de l\'objet requis'),
    body('content').notEmpty().withMessage('Contenu requis'),
    body('type').isIn(['comment', 'status_update', 'alert']).withMessage('Type invalide'),
    body('status').optional().isIn(['active', 'stolen', 'lost', 'found', 'sold', 'damaged'])
        .withMessage('Statut invalide'),
    body('visibility').optional().isIn(['public', 'private', 'admin_only'])
        .withMessage('Visibilité invalide'),
    body('attachments').optional().isArray().withMessage('Format des pièces jointes invalide'),
    body('attachments.*.type').optional().isIn(['image', 'document', 'video'])
        .withMessage('Type de pièce jointe invalide'),
    body('attachments.*.url').optional().isURL().withMessage('URL invalide')
];

// Routes protégées (nécessite authentification)
router.post('/', 
    authMiddleware,
    createCommentValidation,
    commentController.createComment
);

router.get('/item/:itemId',
    authMiddleware.optional,
    commentController.getItemComments
);

router.put('/:commentId',
    authMiddleware,
    [
        body('content').optional().notEmpty().withMessage('Contenu invalide'),
        body('visibility').optional().isIn(['public', 'private', 'admin_only'])
            .withMessage('Visibilité invalide'),
        body('isResolved').optional().isBoolean().withMessage('Format invalide pour isResolved')
    ],
    commentController.updateComment
);

router.delete('/:commentId',
    authMiddleware,
    commentController.deleteComment
);

module.exports = router;
