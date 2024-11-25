const { body, validationResult } = require('express-validator');

// Validation des données d'inscription
exports.validateRegistration = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('Le prénom est requis')
        .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
    
    body('lastName')
        .trim()
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('L\'email est requis')
        .isEmail().withMessage('L\'email n\'est pas valide')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Le mot de passe est requis')
        .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'),
    
    body('phoneNumber')
        .optional()
        .trim()
        .matches(/^(\+33|0)[1-9](\d{2}){4}$/).withMessage('Le numéro de téléphone n\'est pas valide'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }
        next();
    }
];

// Validation des données de connexion
exports.validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('L\'email est requis')
        .isEmail().withMessage('L\'email n\'est pas valide')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Le mot de passe est requis'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }
        next();
    }
];

// Validation du changement de mot de passe
exports.validatePasswordChange = [
    body('currentPassword')
        .notEmpty().withMessage('Le mot de passe actuel est requis'),
    
    body('newPassword')
        .notEmpty().withMessage('Le nouveau mot de passe est requis')
        .isLength({ min: 8 }).withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .withMessage('Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'),
    
    body('confirmPassword')
        .notEmpty().withMessage('La confirmation du mot de passe est requise')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Les mots de passe ne correspondent pas');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }
        next();
    }
];

// Validation de la mise à jour du profil
exports.validateProfileUpdate = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
    
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
    
    body('phoneNumber')
        .optional()
        .trim()
        .matches(/^(\+33|0)[1-9](\d{2}){4}$/).withMessage('Le numéro de téléphone n\'est pas valide'),
    
    body('address')
        .optional()
        .isObject().withMessage('L\'adresse doit être un objet valide'),
    
    body('address.street')
        .optional()
        .trim()
        .notEmpty().withMessage('La rue est requise'),
    
    body('address.city')
        .optional()
        .trim()
        .notEmpty().withMessage('La ville est requise'),
    
    body('address.postalCode')
        .optional()
        .trim()
        .matches(/^\d{5}$/).withMessage('Le code postal doit contenir 5 chiffres'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }
        next();
    }
];
