const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

async function seedAdmin() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/react_collage");
    console.log("Connected to MongoDB for seeding...");

    const adminId = "admin@tp.portal";
    const password = "adminpassword123";

    const existingAdmin = await Admin.findOne({ userId: adminId });
    if (existingAdmin) {
      console.log("Admin already exists:", adminId);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        userId: adminId,
        password: hashedPassword,
        role: "admin"
      });
      await newAdmin.save();
      console.log("Admin seeded successfully!");
      console.log("ID:", adminId);
      console.log("Password:", password);
    }
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmin();
