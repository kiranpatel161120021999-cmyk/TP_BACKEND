const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  trainingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Training",
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed" // Simulation: Default to completed for now
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    unique: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
