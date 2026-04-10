const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

router.post("/add", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();

    res.json({ message: "Job Added Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("companyId");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET jobs by companyID
router.get("/company/:companyId", async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.params.companyId });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;