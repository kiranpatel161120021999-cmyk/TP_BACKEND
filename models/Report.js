const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Placement", "Training", "Student", "Company", "Finance", "System"],
    default: "System" 
  },
  generatedBy: { type: String, default: "Admin" }, // Can be ref: Admin if needed
  data: { type: mongoose.Schema.Types.Mixed }, // JSON payload of statistics
  fileUrl: { type: String }, // Optional path to a PDF/CSV file
  status: { type: String, enum: ["Generated", "Pending", "Archived"], default: "Generated" }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
