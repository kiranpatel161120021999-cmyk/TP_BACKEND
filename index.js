require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// Updated CORS: Allow frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://tp-frontend-n04kx2ecx-kiranpatel161120021999-cmyks-projects.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// static uploads folder
const uploadsPath = path.resolve(__dirname, "uploads");
console.log("Serving static files from:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

// MongoDB connection — reads from .env MONGO_URI, falls back to local
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/react_collage")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// routes
app.get("/api/test", (req, res) => res.json({ message: "API is working" }));
app.use("/api/applications", applicationRoutes);
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/mock-interview", require("./routes/mockInterviewRoutes"));
app.use("/api/trainings", require("./routes/trainingRoutes"));
app.use("/api/syllabus", require("./routes/pdfRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// root health check
app.get("/", (req, res) => res.send("✅ Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));