const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  title: String,
  salary: String,
  eligibility: String,
  deadline: Date
});

module.exports = mongoose.model("Job", jobSchema);