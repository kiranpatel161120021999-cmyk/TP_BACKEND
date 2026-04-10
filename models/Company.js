const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  sector: String,
  description: String
});

module.exports = mongoose.model("Company", companySchema);