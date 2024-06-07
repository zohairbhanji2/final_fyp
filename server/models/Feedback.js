const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  MobileNo: String,
  Comment: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;