const mongoose = require("mongoose");
const Student = require("./models/Student");
const Company = require("./models/Company");
const Training = require("./models/Training");
const Application = require("./models/Application");
const Enrollment = require("./models/Enrollment");
const MockInterviewSession = require("./models/MockInterviewSession");
require("dotenv").config();

const DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/collegeDB";

const seed = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to DB: ${DB_URI}...`);

    let student = await Student.findOne();
    if (!student) {
        student = await Student.create({
            name: "John Doe", email: "john@example.com", password: "password123",
            branch: "Computer Science", year: "4th", course: "B.Tech", mobile: "9876543210"
        });
    }

    let training = await Training.findOne();
    if (!training) {
        training = await Training.create({
            title: "Advanced React", subject: "Frontend", description: "Deep dive.",
            duration: "12 Weeks", price: 4999, status: "Full-Time", startDate: new Date()
        });
    }

    const student2 = await Student.findOneAndUpdate(
        { email: "jane@example.com" },
        { name: "Jane Smith", email: "jane@example.com", branch: "IT", year: "3rd", mobile: "9998887776", course: "B.Tech" },
        { upsert: true, new: true }
    );

    // Clear old sample data
    await Enrollment.deleteMany({ trainingTitle: "Advanced React" });
    await MockInterviewSession.deleteMany({ category: { $in: ["technical", "hr"] } });
    await Application.deleteMany({ email: { $in: ["john@example.com", "jane@example.com", "sam@example.com"] } });

    // Placement status
    await Student.findByIdAndUpdate(student._id, { placed: true, placedCompany: "Google Cloud", salary: "18.5 LPA" });

    // 5. Seed Enrollments (Added more diverse financial data)
    await Enrollment.insertMany([
      { studentId: student._id, studentName: student.name, trainingId: training._id, trainingTitle: "Java Fullstack Expert", status: "Completed", amount: 5000, transactionId: "TXN_9821_SUCCESS" },
      { studentId: student2._id, studentName: student2.name, trainingId: training._id, trainingTitle: "Python Data Science", status: "Active", amount: 3500, transactionId: "TXN_7742_PENDING" },
      { studentId: student._id, studentName: "Rahul Sharma", trainingId: training._id, trainingTitle: "React Architecture", status: "Completed", amount: 4999, transactionId: "TXN_1120_SUCCESS" },
      { studentId: student2._id, studentName: "Priya Varma", trainingId: training._id, trainingTitle: "Machine Learning v2", status: "Failed", amount: 12000, transactionId: "TXN_4490_FAILED" },
      { studentId: student._id, studentName: "Amit Patel", trainingId: training._id, trainingTitle: "Cloud Computing", status: "Completed", amount: 8500, transactionId: "TXN_3381_SUCCESS" }
    ]);

    // Mock Sessions 
    await MockInterviewSession.insertMany([
      { studentId: student._id, category: "technical", question: "What is React?", answerText: "A library.", score: 90, feedback: "Good.", improvements: "None." },
      { studentId: student2._id, category: "hr", question: "Tell me about yourself.", answerText: "Hi.", score: 80, feedback: "Nice.", improvements: "More detail." }
    ]);

    // Applications (Fixed: Added required email, address, location, resume)
    await Application.insertMany([
      { name: student.name, email: student.email, address: "NYC", location: "Mountain View", resume: "john_resume.pdf", role: "SDE-1", company: "Google Cloud", status: "Selected", phone: student.mobile },
      { name: student2.name, email: student2.email, address: "London", location: "Redmond", resume: "jane_resume.pdf", role: "Web Dev", company: "Microsoft", status: "Shortlisted", phone: student2.mobile }
    ]);

    console.log("✅ Final Seeding Successful! Your reports now have data.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
