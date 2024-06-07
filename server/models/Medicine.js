const mongoose = require("mongoose");


const medicineSchema = new mongoose.Schema({
  Category: String,
  Name: String,
  CatId: Number,
  Price: Number,
  Stock: Number,
  Barcode: String,
  GenericName: String,
  Manufacturer: String
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;