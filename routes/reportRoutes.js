const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const Student = require("../models/Student");
const Application = require("../models/Application");
const Training = require("../models/Training");

// Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate a new system snapshot report
router.post("/generate", async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const placedCount = await Student.countDocuments({ placed: true });
    const appCount = await Application.countDocuments();
    const trainingCount = await Training.countDocuments();

    const report = new Report({
      title: `System Performance - ${new Date().toLocaleDateString()}`,
      type: "System",
      generatedBy: "Auto-System",
      data: {
        totalStudents: studentCount,
        placedStudents: placedCount,
        placementRate: studentCount > 0 ? ((placedCount / studentCount) * 100).toFixed(2) + "%" : "0%",
        totalApplications: appCount,
        activeTrainings: trainingCount
      }
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a report
router.delete("/:id", async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
