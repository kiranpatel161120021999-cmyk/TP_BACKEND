const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Training = require("../models/Training");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/trainings");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// GET all trainings
router.get("/", async (req, res) => {
  try {
    const trainings = await Training.find({ status: "active" });
    res.json(trainings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trainings" });
  }
});

// GET training by ID
router.get("/:id", async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: "Training not found" });
    res.json(training);
  } catch (err) {
    res.status(500).json({ message: "Error fetching training details" });
  }
});

// CREATE/UPDATE Training with Syllabus
router.post("/save", async (req, res) => {
  const { id, title, subject, description, duration, startDate, price, language, level, syllabus, instructor } = req.body;
  
  try {
    let training;
    if (id) {
      training = await Training.findByIdAndUpdate(id, {
        title, subject, description, duration, startDate, price, language, level, syllabus, instructor
      }, { new: true });
    } else {
      training = new Training({
        title, subject, description, duration, startDate, price, language, level, syllabus, instructor
      });
      await training.save();
    }
    res.json(training);
  } catch (err) {
    console.error("Save Training Error:", err);
    res.status(500).json({ message: "Internal server error saving training" });
  }
});

// UPLOAD Training Media (Video/PDF)
router.post("/upload/:id", upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 5 } // Allow multiple PDFs for weeks
]), async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ message: "Training not found" });

    if (req.files.video) {
      training.videoUrl = `/uploads/trainings/${req.files.video[0].filename}`;
    }

    // Handled in a more complex way if we want per-week PDFs
    // For now, let's just save the latest main notesUrl or specific week pdf
    if (req.files.pdf) {
      // In a real app, we'd match the file to a specific week index passed in body
      // Simplified: Just returning the path for the admin to assign
      return res.json({ 
        message: "Upload Successful", 
        videoUrl: training.videoUrl,
        pdfPath: `/uploads/trainings/${req.files.pdf[0].filename}` 
      });
    }

    await training.save();
    res.json({ message: "Asset uploaded successfully", videoUrl: training.videoUrl });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

const Enrollment = require("../models/Enrollment");

// ENROLL in a training (Simulated Payment Success)
router.post("/enroll", async (req, res) => {
  const { studentId, trainingId, amount } = req.body;
  
  console.log("📥 Enrollment Request Received:", { studentId, trainingId, amount });

  try {
    // 1. Validate IDs
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(trainingId)) {
      console.error("❌ Invalid ID format detected:", { studentId, trainingId });
      return res.status(400).json({ message: "Invalid Student or Course ID format" });
    }

    const sId = new mongoose.Types.ObjectId(studentId);
    const tId = new mongoose.Types.ObjectId(trainingId);

    // 2. Check if already enrolled
    const existing = await Enrollment.findOne({ studentId: sId, trainingId: tId });
    if (existing) {
      return res.status(400).json({ message: "Admission already confirmed. Check your Dashboard." });
    }

    // 3. Finalize Enrollment
    const enrollment = new Enrollment({
      studentId: sId,
      trainingId: tId,
      amount: amount || 8000,
      paymentStatus: "completed",
      transactionId: "TXN-" + Date.now() + Math.round(Math.random() * 1000)
    });

    await enrollment.save();
    
    res.status(200).json({ message: "Enrollment Confirmed ✅", enrollment });
  } catch (error) {
    console.error("❌ CRITICAL ENROLLMENT ERROR:", error);
    res.status(500).json({ message: "Admission failed. Check ID format or database connection." });
  }
});

// GET my enrolled trainings
router.get("/my-enrollments/:studentId", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: new mongoose.Types.ObjectId(req.params.studentId) })
      .populate("trainingId");
    
    // Flatten the result to just return the training objects
    const trainings = enrollments.map(e => {
      if (e.trainingId && e.trainingId._doc) {
        return {
          ...e.trainingId._doc,
          paymentStatus: e.paymentStatus || 'Completed',
          amountPaid: e.amount || 9440,
          enrolledAt: e.enrolledAt,
          transactionId: e.transactionId
        };
      } else {
        // Handle mock or deleted courses
        return {
          _id: e._doc.trainingId || e._id,
          title: "Campus Corporate Training Module",
          description: "Premium masterclass designed for skill enhancement and placement preparation.",
          paymentStatus: e.paymentStatus || 'Completed',
          amountPaid: e.amount || 9440,
          enrolledAt: e.enrolledAt,
          transactionId: e.transactionId
        };
      }
    });

    res.json(trainings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your enrollments" });
  }
});

module.exports = router;
