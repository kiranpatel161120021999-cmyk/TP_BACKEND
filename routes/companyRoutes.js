const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

router.post("/add", async (req, res) => {
  const company = new Company(req.body);
  await company.save();
  res.json({ msg: "Company Added ✅" });
});

router.get("/", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

router.put("/:id", async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCompany);
  } catch (err) {
    res.status(500).json({ error: "Failed to update company."});
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete company."});
  }
});

module.exports = router;