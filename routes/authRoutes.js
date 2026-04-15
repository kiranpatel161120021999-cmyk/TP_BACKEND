const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

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

// ===== SEND OTP =====
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(email.trim().toLowerCase(), { code, expires });

    // Send email (handling failures gracefully in dev)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await sendOTPEmail(email, code);
        res.json({ message: `OTP sent successfully to your email with code : ${code}` });
        
      } else {
        console.log(`⚠️ Email credentials missing. OTP for ${email}: ${code}`);
        res.json({ message: `OTP generated (Check server console) ${email} 🛡️` });
      }
    } catch (mailErr) {
      console.error("Mail Error:", mailErr);
      console.log(`Fallback: OTP for ${email}: ${code}`);
      res.json({ message: "Email failed, but code generated (Check console) 🛡️" });
    }
  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ message: "Failed to process OTP" });
  }
});

// ===== VERIFY OTP & LOGIN =====
router.post("/verify-otp", async (req, res) => {
  const { email, password, otp } = req.body;
  const lowerEmail = email.trim().toLowerCase();

  // 1. Verify OTP
  const record = otpStore.get(lowerEmail);
  if (!record || record.code !== otp) {
    console.log(`❌ OTP Verification Failed for ${lowerEmail}. Provided: ${otp}, Expected: ${record?.code}`);
    return res.status(400).json({ message: "Invalid OTP code" });
  }
  if (Date.now() > record.expires) {
    otpStore.delete(lowerEmail);
    console.log(`❌ OTP Expired for ${lowerEmail}`);
    return res.status(400).json({ message: "OTP has expired" });
  }

  // 2. Handle Login vs Signup
  try {
    let user = await Student.findOne({ email: lowerEmail });
    let isNewUser = false;

    if (!user) {
      // Check Admin collection too (maybe they are logging in as admin)
      user = await Admin.findOne({ $or: [{ email: lowerEmail }, { userId: lowerEmail }] });
      
      if (!user) {
        if (req.body.name) {
          // It's a Signup (name provided)
          const hashedPassword = await bcrypt.hash(password, 10);
          user = new Student({
            name: req.body.name,
            email: lowerEmail,
            password: hashedPassword,
            branch: req.body.branch || "Not Set",
            year: req.body.year || "3rd", // Default
          });
          await user.save();
          isNewUser = true;
          console.log(`✅ New user created via OTP: ${lowerEmail}`);
        } else {
          // It's a Login for non-existent user
          console.log(`❌ User not found during OTP verification: ${lowerEmail}`);
          return res.status(400).json({ message: "User not found. Please signup first." });
        }
      }
    }

    // 3. Password Check (for existing users)
    if (!isNewUser) {
      const isHashed = user.password.startsWith("$2");
      const passwordValid = isHashed ? await bcrypt.compare(password, user.password) : (password === user.password);

      // DEBUG BYPASS for developer account or if password is 'student123'
      const isDebugEmail = lowerEmail === "kp20021123@gmail.com";
      
      if (!passwordValid && !isDebugEmail) {
        console.log(`❌ Password mismatch for ${lowerEmail}. Hashed: ${isHashed}`);
        return res.status(400).json({ message: "Invalid password matching this OTP." });
      } else if (isDebugEmail && !passwordValid) {
        console.log(`⚠️ Debug Bypass: Letting ${lowerEmail} through despite password mismatch.`);
      }
    }

    // 4. Success! Consume OTP now.
    otpStore.delete(lowerEmail); 

    const finalRole = user.role || "student";
    res.json({ 
      message: isNewUser ? "Registration successful ✅" : "Identity verified ✅",
      role: finalRole,
      user: { id: user._id, name: user.name || user.userId || "User", email: user.email || lowerEmail }
    });
  } catch (err) {
    console.error("Verify Auth Error:", err);
    res.status(500).json({ message: "Internal server error during verification" });
  }
});

// ===== GOOGLE LOGIN =====
router.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await Student.findOne({ email });
    let userRole = "student";

    if (!user) {
      user = await Admin.findOne({ email });
      if (user) userRole = "admin";
    }

    // Auto-create student if not found (optional behavior)
    if (!user) {
      user = new Student({
        name,
        email,
        password: await bcrypt.hash(googleId, 10), // Placeholder password
        branch: "Not Set",
        year: "Not Set",
      });
      await user.save();
    }

    res.json({
      message: "Google login successful ✅",
      role: user.role || userRole,
      user: { id: user._id, name: user.name || name, email: user.email || email }
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
});

// ===== LEGACY LOGIN =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Student.findOne({ email });
    let userRole = "student";

    if (!user) {
      user = await Admin.findOne({ 
        $or: [{ email: email }, { userId: email }] 
      });
      userRole = "admin";
    }

    if (!user) return res.status(400).json({ message: "User not found" });

    const isHashed = user.password.startsWith("$2");
    const passwordValid = isHashed ? await bcrypt.compare(password, user.password) : (password === user.password);

    if (!passwordValid) return res.status(400).json({ message: "Invalid password" });

    res.json({ 
      message: "Login successful ✅",
      role: user.role || userRole,
      user: { id: user._id, name: user.name || user.userId || "User", email: user.email || email }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;