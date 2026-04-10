const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  branch: String,
  year: String
});

module.exports = mongoose.model("Student", studentSchema);