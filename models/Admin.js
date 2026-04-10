/* eslint-env node */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    userId: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: "admin" }
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("Admin", adminSchema);
