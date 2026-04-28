const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfController = require("../controllers/pdfController");

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "../uploads/syllabus";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  }
});

router.post("/upload", upload.single("pdf"), pdfController.uploadPdf);
router.get("/", pdfController.getPdfs);
router.put("/:id", upload.single("pdf"), pdfController.updatePdf);
router.delete("/:id", pdfController.deletePdf);

module.exports = router;
