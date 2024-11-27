const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const searchHistoryRoutes = require('./routes/searchHistory');
const userRoutes = require('./routes/user');
const itemRoutes = require('./routes/item');
const authRoutes = require('./routes/auth');
const geocodeRoutes = require('./routes/geocode');
const { router: adminAuthRouter } = require('./routes/adminAuth');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // URL de votre client React
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/search-history', searchHistoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/geocode', geocodeRoutes);
app.use('/api/admin', adminAuthRouter);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ovpr';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
