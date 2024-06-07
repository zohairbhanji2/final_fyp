const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  medicine: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const prescription = mongoose.model('prescription', prescriptionSchema);

module.exports = prescription;