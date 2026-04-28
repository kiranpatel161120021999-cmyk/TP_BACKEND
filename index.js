require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// Updated CORS: Allow frontend origins dynamically
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // 2. Allow local development
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);

    // 3. SECURE DYNAMIC CHECK: Allow any Vercel deployment for this project
    // This handles both https://your-app.vercel.app AND preview branches
    if (origin.endsWith(".vercel.app") && origin.includes("kiranpatel161120021999")) {
      return callback(null, true);
    }

    // 4. Fallback: Block others
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// static uploads folder - Use path to ensure it points correctly to backend/uploads
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/react_collage")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// routes
app.use("/api/applications", applicationRoutes);
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/mock-interview", require("./routes/mockInterviewRoutes"));
app.use("/api/trainings", require("./routes/trainingRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.get("/api/test", (req, res) => res.json({ msg: "ok" }));

// test route (to check server)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Final Error Handling Middleware - JSON and CORS friendly
app.use((err, req, res, next) => {
  console.error("Critical Server Error:", err.stack);
  res.status(500).json({ 
    message: "Internal server error 🚨", 
    error: process.env.NODE_ENV === "development" ? err.message : "Hidden" 
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});