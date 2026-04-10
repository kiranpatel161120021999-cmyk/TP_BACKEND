const mongoose = require("mongoose");

const mockInterviewSessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["hr", "technical"],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answerText: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  improvements: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MockInterviewSession", mockInterviewSessionSchema);
