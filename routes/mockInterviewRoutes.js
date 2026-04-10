const express = require("express");
const router = express.Router();
const MockInterviewSession = require("../models/MockInterviewSession");

// @route   POST /api/mock-interview/save
// @desc    Save a mock interview session result
// @access  Public (in real app should be private/authenticated)
router.post("/save", async (req, res) => {
  try {
    const { studentId, category, question, answerText, score, feedback, improvements } = req.body;

    const newSession = new MockInterviewSession({
      studentId: studentId || "000000000000000000000000", // Fallback if no user is provided for testing
      category,
      question,
      answerText,
      score,
      feedback,
      improvements,
    });

    const savedSession = await newSession.save();
    return res.status(201).json({ message: "Mock interview saved successfully", session: savedSession });
  } catch (error) {
    console.error("Error saving mock interview:", error);
    return res.status(500).json({ message: "Server Error: Could not save interview data" });
  }
});

module.exports = router;
