const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const { initializeSocket } = require('./config/socketio');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialisation de Socket.IO
const io = initializeSocket(server);

// Middleware pour rendre io accessible dans les routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const searchRoutes = require('./routes/searchRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);

// Routes de base
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'API OVPR opérationnelle' });
});

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, 'client/build')));

// Toutes les autres routes non-API renvoient l'application React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Une erreur est survenue sur le serveur',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Port d'écoute
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✨ Serveur démarré sur http://localhost:${PORT}`);
});
