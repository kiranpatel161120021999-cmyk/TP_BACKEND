const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  customId: { type: String, unique: true }, // ⭐ Custom ID
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["student", "company", "admin"] }
});

module.exports = mongoose.model("User", userSchema);