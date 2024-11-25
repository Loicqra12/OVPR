const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// Routes publiques
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Routes protégées
router.get('/me', auth, authController.getMe);
router.put('/update-profile', auth, authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);
router.post('/logout', auth, authController.logout);

// Routes de gestion de session
router.post('/refresh-token', authController.refreshToken);
router.get('/check-auth', auth, (req, res) => {
    res.json({ 
        isAuthenticated: true, 
        user: req.user 
    });
});

module.exports = router;
