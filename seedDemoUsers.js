const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("./models/Student");
const Admin = require("./models/Admin");
const Company = require("./models/Company");
const Job = require("./models/Job");

async function seedDemoUsers() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/react_collage");
    console.log("Connected to MongoDB for demo seeding...");

    // 1. Seed Student
    const studentEmail = "student@demo.com";
    const studentPass = "student123";
    const hashedStudentPass = await bcrypt.hash(studentPass, 10);
    
    await Student.findOneAndUpdate(
      { email: studentEmail },
      { 
        name: "Demo Student", 
        email: studentEmail, 
        password: hashedStudentPass,
        branch: "CSE",
        year: "3rd",
        course: "B.Tech",
        batch: "2025"
      },
      { upsert: true, new: true }
    );
    console.log("Student Seeded: ", studentEmail);

    // 2. Seed Company User (stored in Admin collection with role: 'company')
    const companyEmail = "hr@google.com";
    const companyPass = "google123";
    const hashedCompanyPass = await bcrypt.hash(companyPass, 10);

    await Admin.findOneAndUpdate(
      { email: companyEmail },
      {
        name: "Google HR",
        email: companyEmail,
        userId: "google@hr",
        password: hashedCompanyPass,
        role: "company"
      },
      { upsert: true, new: true }
    );
    console.log("Company User Seeded: ", companyEmail);

    // 2.1 Seed Company Entity
    const demoCompany = await Company.findOneAndUpdate(
      { email: companyEmail },
      {
        name: "Google",
        email: companyEmail,
        location: "Palo Alto, CA",
        sector: "Technology",
        description: "Organizing the world's information and making it universally accessible and useful."
      },
      { upsert: true, new: true }
    );
    console.log("Company Entity Seeded: ", companyEmail);

    // 2.2 Seed Sample Jobs for Demo Company
    await Job.deleteMany({ companyId: demoCompany._id }); // Clean old demo jobs
    await Job.insertMany([
      {
        companyId: demoCompany._id,
        title: "Software Engineering Intern",
        salary: "60k",
        eligibility: "7.0+ CGPA, Knowledge of DSA",
        deadline: new Date("2026-06-15")
      },
      {
        companyId: demoCompany._id,
        title: "Associate Product Manager",
        salary: "12 LPA",
        eligibility: "8.0+ CGPA, Strong Communication",
        deadline: new Date("2026-07-01")
      }
    ]);
    console.log("Sample Jobs Seeded for Google");

    // 3. Ensure Admin exists (matching seedAdmin.js)
    const adminEmail = "admin@tp.portal";
    const adminPass = "adminpassword123";
    const hashedAdminPass = await bcrypt.hash(adminPass, 10);

    await Admin.findOneAndUpdate(
      { userId: adminEmail },
      {
        userId: adminEmail,
        password: hashedAdminPass,
        role: "admin"
      },
      { upsert: true, new: true }
    );
    console.log("Admin User Seeded: ", adminEmail);

    console.log("Seeding complete! ✅");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDemoUsers();
