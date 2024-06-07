const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  shopEmail: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  response: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  answered: {
    type: Boolean,
    default: false,
  },
});

const question = mongoose.model('Question', questionSchema);

module.exports = question;
