const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  startDate: { type: String, required: true },
  fileUrl: { type: String },
  details: { type: String },
  instructor: { type: String },
  image: { type: String },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Training", trainingSchema);
