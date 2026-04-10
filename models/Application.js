const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  coverLetter: {
    type: String
  },

  resume: {
    type: String,
    required: true
  },

  company: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },
  phone: String,
  portfolio: String,
  status: { type: String, default: "Submitted" }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);