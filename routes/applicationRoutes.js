const express = require("express");
const multer = require("multer");
const Application = require("../models/Application");
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Submit application
router.post("/applyjob", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, address, coverLetter, company, role, location, phone, portfolio } = req.body;
    const resume = req.file ? req.file.path : "";

    const application = new Application({
      name, email, address, coverLetter, resume, company, role, location, phone, portfolio
    });
    
    await application.save();
    res.json({ message: "Application Submitted Successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get applications by email
router.get("/user/:email", async (req, res) => {
  try {
    const apps = await Application.find({ email: req.params.email });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get applications by company name
router.get("/company/:companyName", async (req, res) => {
  try {
    const apps = await Application.find({ company: req.params.companyName });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update application status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;