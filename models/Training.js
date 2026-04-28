const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  startDate: { type: String, required: true },
  price: { type: Number, default: 0 },
  language: { type: String },
  level: { type: String, default: "Beginner" },
  syllabus: [
    {
      week: Number,
      title: String,
      lessons: Number,
      description: String,
      pdfUrl: String,
      assignmentUrl: String,
    },
  ],
  videoUrl: { type: String },
  image: { type: String },
  instructor: { type: String },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Training", trainingSchema);
