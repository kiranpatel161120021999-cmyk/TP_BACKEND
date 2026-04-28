const SyllabusPdf = require("../models/PdfModel");
const path = require("path");
const fs = require("fs");

// Upload PDF
exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No PDF file uploaded" });

    const { title, trainingId } = req.body;
    const newPdf = new SyllabusPdf({
      title,
      fileUrl: `/uploads/syllabus/${req.file.filename}`,
      trainingId: trainingId || null,
      uploadedBy: req.body.uploadedBy || "Admin"
    });

    await newPdf.save();
    res.status(201).json({ message: "Syllabus uploaded successfully", data: newPdf });
  } catch (err) {
    res.status(500).json({ message: "Server error during upload" });
  }
};

// GET all PDFs
exports.getPdfs = async (req, res) => {
  try {
    const pdfs = await SyllabusPdf.find().sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching PDFs" });
  }
};

// Update PDF (Replace existing)
exports.updatePdf = async (req, res) => {
  try {
    const pdf = await SyllabusPdf.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "Syllabus not found" });

    if (req.file) {
      // Remove old file
      const oldPath = path.join(__dirname, "../../", pdf.fileUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      pdf.fileUrl = `/uploads/syllabus/${req.file.filename}`;
    }

    if (req.body.title) pdf.title = req.body.title;
    await pdf.save();

    res.json({ message: "Syllabus updated successfully", data: pdf });
  } catch (err) {
    res.status(500).json({ message: "Error updating PDF" });
  }
};

// Delete PDF
exports.deletePdf = async (req, res) => {
  try {
    const pdf = await SyllabusPdf.findById(req.params.id);
    if (!pdf) return res.status(404).json({ message: "Syllabus not found" });

    // Remove file from server
    const filePath = path.join(__dirname, "../../", pdf.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await SyllabusPdf.findByIdAndDelete(req.params.id);
    res.json({ message: "Syllabus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting PDF" });
  }
};
