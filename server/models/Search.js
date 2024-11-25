const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    type: String,
    required: true
  },
  filters: {
    category: String,
    dateRange: String,
    radius: Number,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index géospatial pour les recherches par proximité
searchHistorySchema.index({ 'filters.coordinates': '2dsphere' });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
