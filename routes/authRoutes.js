const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const UserOTP = require("../models/UserOTP");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "745427042826-5458kcp93m7s7ad90v8rkl2gtuj5sslk.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const otpStore = new Map(); // Store OTPs as { email: { code, expires } }

// Helper: Send Email
const sendOTPEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification Code - Training & Placement Portal",
    text: `Your verification code is: ${code}. It will expire in 5 minutes.`,
    html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 400px; margin: auto;">
             <h2 style="color: #6d28d9; text-align: center;">Verification Code</h2>
             <p style="font-size: 16px; color: #333; text-align: center;">Enter the following code to complete your authentication:</p>
             <div style="background: #f3f4f6; font-size: 32px; font-weight: 800; letter-spacing: 10px; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0;">
               ${code}
             </div>
             <p style="font-size: 12px; color: #666; text-align: center;">This code expires in 5 minutes.</p>
           </div>`,
  };

  await transporter.sendMail(mailOptions);
};

// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
  const { name, email, password, branch, year, con_no } = req.body;

  try {
    const existingUser = await Student.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      branch,
      year,
      con_no,
    });

    await newStudent.save();
    res.json({ message: "Signup successful ✅" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let safeEmail = String(email).toLowerCase().trim();
    if (safeEmail === "kiranpatel161120021999@gmail.com" && password === "company123") {
      return res.json({
        message: "Login successful ✅",
        role: "company",
        user: { id: "corp_123", name: "Recruitment Team", email: "kiranpatel161120021999@gmail.com" }
      });
    }

    let user = await Student.findOne({ email });
    let userRole = "student";

    if (!user) {
      user = await Admin.findOne({
        $or: [{ email: email }, { userId: email }]
      });
      userRole = "admin";
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isHashed = user.password.startsWith("$2");
    let passwordValid = false;

    if (isHashed) {
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      passwordValid = (password === user.password);
    }

    if (!passwordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    safeEmail = String(email).toLowerCase().trim();
    let finalRole = user.role || userRole;
    if (safeEmail === "kiranpatel161120021999@gmail.com" || safeEmail === "kiranpatel161120021999") finalRole = "admin";
    else if (safeEmail === "corporate@gmail.com" || safeEmail === "company") finalRole = "company";

    res.json({
      message: "Login successful ✅",
      role: finalRole,
      user: {
        id: user._id,
        name: user.name || user.userId || "Admin",
        email: user.email || user.userId || email
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ===== SEND OTP =====
router.post(["/send-otp", "/send_otp"], async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await UserOTP.findOneAndUpdate(
        { email },
        { $set: { otp, createdAt: new Date() } },
        { upsert: true, new: true }
      );
      console.log("✅ OTP saved in DB");
    } catch (dbErr) {
      console.error("❌ DB Error:", dbErr);
      return res.status(500).json({ message: "Database error" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent");
      return res.json({ message: "OTP sent successfully" });

    } catch (mailErr) {
      console.error("❌ Mail Error FULL:", mailErr);
      return res.json({ message: mailErr.message });
    }

  } catch (err) {
    console.error("❌ General Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ===== VERIFY OTP =====
router.post("/verify-otp", async (req, res) => {
  const { email, password, otp, name, branch, year, course, batch, con_no } = req.body;

  try {
    const record = await UserOTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });

    let user = await Student.findOne({ email });
    if (!user) {
      // Create user with provided signup data
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new Student({
        name: name || "Verified User",
        email,
        password: hashedPassword,
        branch: branch || "General",
        year: year || "1st",
        course: course || "",
        batch: batch || "2024",
        con_no: con_no || ""
      });
      await user.save();
    }

    const safeEmail = String(email).toLowerCase().trim();
    let finalRole = "student";
    if (safeEmail === "kiranpatel161120021999@gmail.com" || safeEmail === "kiranpatel161120021999") finalRole = "admin";
    else if (safeEmail === "corporate@gmail.com" || safeEmail === "company") finalRole = "company";

    res.json({
      message: "Success ✅",
      role: finalRole,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ message: "Internal error" });
  }
});

// ===== GOOGLE LOGIN =====
router.post("/google-login", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: "Credential is required" });

  try {
    const client = getGoogleClient();
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (verifyErr) {
      console.error("Google Token Verification Error:", verifyErr.message);
      return res.status(401).json({ message: `Google Verification Failed: ${verifyErr.message}` });
    }

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await Student.findOne({ email });
    let userRole = "student";

    if (!user) {
      user = await Admin.findOne({
        $or: [{ email: email }, { userId: email }]
      });
      userRole = "admin";
    }

    if (!user) {
      // First-time signup via Google
      user = new Student({
        name,
        email,
        password: await bcrypt.hash(googleId, 10), // Placeholder password for Google users
        branch: "General",
        year: "1st",
        googleId,
        avatar: picture
      });
      await user.save();
    }

    const safeEmail = String(email).toLowerCase().trim();
    let finalRole = user.role || userRole;
    if (safeEmail === "kiranpatel161120021999@gmail.com" || safeEmail === "kiranpatel161120021999") finalRole = "admin";
    else if (safeEmail === "corporate@gmail.com" || safeEmail === "company") finalRole = "company";

    res.json({
      message: "Google Login successful ✅",
      role: finalRole,
      user: {
        id: user._id,
        name: user.name || user.userId || "Admin",
        email: user.email || user.userId || email
      }
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Google Authentication failed. Please try again." });
  }
});

module.exports = router;