const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdf = require("pdf-parse");

// Configure Multer (memory storage for quick processing)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper: Simple Resume Analysis Engine
const analyzeResumeText = (text) => {
  const lowerText = text.toLowerCase();
  
  // 1. Skill Detection
  const techSkills = [
    "react", "node", "javascript", "python", "java", "sql", "mongodb", 
    "aws", "docker", "typescript", "html", "css", "c++", "flutter"
  ];
  const foundSkills = techSkills.filter(s => lowerText.includes(s));
  
  // 2. Section Detection
  const hasExperience = lowerText.includes("experience") || lowerText.includes("work history");
  const hasEducation = lowerText.includes("education") || lowerText.includes("academic");
  const hasProjects = lowerText.includes("projects") || lowerText.includes("portfolio");
  const hasContact = lowerText.includes("email") || lowerText.includes("@") || lowerText.includes("phone") || lowerText.includes("+");

  // 3. Scoring Logic
  let score = 30; // base score
  if (foundSkills.length > 5) score += 20;
  else if (foundSkills.length > 2) score += 10;
  
  if (hasExperience) score += 15;
  if (hasEducation) score += 10;
  if (hasProjects) score += 10;
  if (hasContact) score += 15;

  // Cappin score at 98 for that "real" feeling
  score = Math.min(score, 98);

  // 4. Feedback Generation
  const strengths = [];
  const weaknesses = [];
  const tips = [];

  if (foundSkills.length > 4) strengths.push("Strong technical keyword presence");
  if (hasExperience) strengths.push("Professional experience section detected");
  if (hasEducation) strengths.push("Academic background clearly stated");
  
  if (!hasExperience) weaknesses.push("Missing professional experience section");
  if (foundSkills.length < 3) weaknesses.push("Low technical keyword density");
  if (!hasProjects) weaknesses.push("Missing project showcase section");
  
  tips.push("Ensure your experience includes quantifiable metrics (e.g., 'Improved performance by 20%')");
  tips.push("Use standard headings like 'Experience' and 'Skills' for better ATS parsing");
  if (foundSkills.length < 6) tips.push("Add more specific technical tools you've used to improve your ATS match score");

  return {
    score,
    atsMatch: score > 80 ? "High" : (score > 60 ? "Medium" : "Low"),
    skills: foundSkills,
    strengths,
    weaknesses,
    tips
  };
};

// POST /analyze
router.post("/analyze", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Extract text from PDF
    const data = await pdf(req.file.buffer);
    const text = data.text;

    // Analyze text
    const analysis = analyzeResumeText(text);

    // Return results
    res.json({
      message: "Analysis complete",
      analysis
    });
  } catch (err) {
    console.error("Analysis Error:", err);
    res.status(500).json({ message: "Failed to parse resume PDF. Ensure it's not password protected." });
  }
});

module.exports = router;
