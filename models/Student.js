const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  branch: String,
  year: String,
  course: String,
  batch: String,
  con_no: String,
  dob: Date,
  gender: String,
  cgpa: Number,
  skills: [String],
  bio: String,
  location: String,
  education: [{
    degree: String,
    school: String,
    year: String,
    score: String
  }],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  enrolledTrainings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Training' }],
  placed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Student", studentSchema);