const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  query: {
    type: String,
    default: '',
  },
  filters: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  results: {
    type: Number,
    default: 0,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
});

// Index pour améliorer les performances des requêtes
searchHistorySchema.index({ userId: 1, timestamp: -1 });
searchHistorySchema.index({ query: 'text' });
searchHistorySchema.index({ location: '2dsphere' });

// Méthode statique pour obtenir les recherches récentes d'un utilisateur
searchHistorySchema.statics.getRecentSearches = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('-__v');
};

// Méthode statique pour obtenir les recherches populaires
searchHistorySchema.statics.getPopularSearches = function(days = 7, limit = 10) {
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
        query: { $ne: '' },
      },
    },
    {
      $group: {
        _id: '$query',
        count: { $sum: 1 },
        lastUsed: { $max: '$timestamp' },
      },
    },
    {
      $sort: { count: -1, lastUsed: -1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 0,
        query: '$_id',
        count: 1,
        lastUsed: 1,
      },
    },
  ]);
};

// Méthode statique pour obtenir les recherches similaires
searchHistorySchema.statics.getSimilarSearches = function(query, limit = 5) {
  return this.aggregate([
    {
      $match: {
        $text: { $search: query },
      },
    },
    {
      $group: {
        _id: '$query',
        score: { $max: { $meta: 'textScore' } },
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        _id: { $ne: query },
      },
    },
    {
      $sort: { score: -1, count: -1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 0,
        query: '$_id',
        count: 1,
      },
    },
  ]);
};

// Méthode statique pour obtenir les recherches à proximité
searchHistorySchema.statics.getNearbySearches = function(coordinates, maxDistance = 5000, limit = 5) {
  return this.aggregate([
    {
      $match: {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates,
            },
            $maxDistance: maxDistance,
          },
        },
      },
    },
    {
      $group: {
        _id: '$query',
        count: { $sum: 1 },
        distance: { $min: '$distance' },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 0,
        query: '$_id',
        count: 1,
        distance: 1,
      },
    },
  ]);
};

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

module.exports = SearchHistory;
