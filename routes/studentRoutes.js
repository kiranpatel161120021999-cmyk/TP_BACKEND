const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const multer = require("multer");
const path = require("path");

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

router.post("/", upload.single("avatar"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.avatar = `http://localhost:5000/uploads/${req.file.filename}`;
    
    // Combine first and last name for the 'name' field
    if (data.firstName && data.lastName) {
      data.name = `${data.firstName} ${data.lastName}`;
    }

    const student = new Student(data);
    await student.save();
    res.json(student);
  } catch (err) {
    console.error("Enrollment Error:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: "Failed to update student."});
  }
});

router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

router.get("/profile/:email", async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;