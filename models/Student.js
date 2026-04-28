const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  branch: String,
  year: String,
  course: String,
  batch: String,
  con_no: String,
  mobile: String,
  dob: Date,
  gender: String,
  cgpa: Number,
  skills: [String],
  bio: String,
  location: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  country: String,
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
  placed: { type: Boolean, default: false },
  googleId: String,
  avatar: String
});

module.exports = mongoose.model("Student", studentSchema);