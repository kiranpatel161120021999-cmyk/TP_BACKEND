const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  trainingId: { type: mongoose.Schema.Types.ObjectId, ref: "Training", required: false }, // Optional link to training
  uploadedBy: { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SyllabusPdf", pdfSchema);
