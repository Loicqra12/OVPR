const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const SearchHistory = require('../models/SearchHistory');
const auth = require('../middleware/auth');

// Middleware pour enregistrer l'historique de recherche
const logSearch = async (req, res, next) => {
  try {
    if (req.user) {
      await SearchHistory.create({
        userId: req.user._id,
        query: req.query.query || '',
        filters: req.query,
        timestamp: new Date(),
      });
    }
    next();
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la recherche:', error);
    next();
  }
};

// Route principale de recherche
router.get('/', auth, logSearch, async (req, res) => {
  try {
    const {
      query,
      type,
      category,
      condition,
      colors,
      dateFrom,
      dateTo,
      priceRange,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    // Construire le filtre MongoDB
    const filter = {};

    if (query) {
      filter.$text = { $search: query };
    }

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (condition) {
      filter.condition = condition;
    }

    if (colors && colors.length) {
      filter.colors = { $in: Array.isArray(colors) ? colors : [colors] };
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    if (priceRange && Array.isArray(priceRange)) {
      const [min, max] = priceRange;
      if (min !== undefined && max !== undefined) {
        filter.value = { $gte: min, $lte: max };
      }
    }

    // Gérer le tri
    let sort = {};
    if (sortBy) {
      const [field, order] = sortBy.startsWith('-') 
        ? [sortBy.substring(1), -1] 
        : [sortBy, 1];
      sort[field] = order;
    } else {
      sort = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Exécuter la requête
    const [items, total] = await Promise.all([
      Item.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'name email'),
      Item.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les recherches tendances
router.get('/trending', async (req, res) => {
  try {
    const trends = await SearchHistory.aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: '$query',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $ne: '' },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          text: '$_id',
          count: 1,
        },
      },
    ]);

    res.json(trends);
  } catch (error) {
    console.error('Erreur lors de la récupération des tendances:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les catégories populaires
router.get('/categories/popular', async (req, res) => {
  try {
    const categories = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 8,
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: 1,
        },
      },
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
