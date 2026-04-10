const express = require("express");
const router = express.Router();

router.post("/apply", (req, res) => {
  res.json({ message: "Application Submitted" });
});

module.exports = router;