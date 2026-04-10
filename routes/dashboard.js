// routes/dashboard.js
const express = require("express");
const Course = require("../models/Course");
const User = require("../models/User"); // assume User model exists

const router = express.Router();

router.get("/stats", async (req, res) => {
  const totalCourses = await Course.countDocuments();
  const totalUsers = await User.countDocuments();
  const coursesByStatus = await Course.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  res.json({ totalCourses, totalUsers, coursesByStatus });
});

module.exports = router;
