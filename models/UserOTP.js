const mongoose = require("mongoose");

const UserOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes TTL
  },
});

module.exports = mongoose.model("UserOTP", UserOTPSchema);
