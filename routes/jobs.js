const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/jobs");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

router.post("/add", upload.single('image'), async (req, res) => {
  try {
    const jobData = { ...req.body };
    if (!jobData.companyId || jobData.companyId === 'undefined' || jobData.companyId === 'null') {
      delete jobData.companyId;
    }
    if (req.file) {
      jobData.image = `/uploads/jobs/${req.file.filename}`;
    }
    const newJob = new Job(jobData);
    await newJob.save();

    res.json({ message: "Job Added Successfully", job: newJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", upload.single('image'), async (req, res) => {
  try {
    const jobData = { ...req.body };
    delete jobData._id;
    delete jobData.__v;
    if (!jobData.companyId || jobData.companyId === 'undefined' || jobData.companyId === 'null') {
      delete jobData.companyId;
    }
    if (req.file) {
      jobData.image = `/uploads/jobs/${req.file.filename}`;
    }
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, jobData, { new: true });
    res.json({ message: "Job Updated Successfully", job: updatedJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job Deleted Successfully" });
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