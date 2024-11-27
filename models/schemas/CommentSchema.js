const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['comment', 'status_update', 'alert'],
    default: 'comment'
  },
  status: {
    type: String,
    enum: ['registered', 'stolen', 'lost', 'found', 'returned', 'sold'],
    required: function() {
      return this.type === 'status_update';
    }
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'admin_only'],
    default: 'public'
  },
  attachments: [{
    url: String,
    description: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = CommentSchema;
