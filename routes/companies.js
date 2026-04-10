const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { name: "Infosys", role: "Software Engineer" },
    { name: "TCS", role: "System Engineer" },
    { name: "Wipro", role: "Developer" }
  ]);
});

module.exports = router;