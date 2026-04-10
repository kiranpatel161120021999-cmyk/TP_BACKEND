const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  views: Number,
  comments: Number,
  status: {
    type: String,
    default: "Published"
  }
}, { timestamps: true });

module.exports = mongoose.model("Article", articleSchema);