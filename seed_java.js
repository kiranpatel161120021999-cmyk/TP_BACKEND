const mongoose = require('mongoose');

// Define the Schema inside the script for self-containment
const SyllabusSchema = new mongoose.Schema({
  week: Number,
  title: String,
  description: String,
  lessons: Number,
  pdfUrl: String
});

const TrainingSchema = new mongoose.Schema({
  title: String,
  subject: String,
  description: String,
  duration: String,
  startDate: String,
  price: Number,
  language: String,
  level: String,
  syllabus: [SyllabusSchema],
  instructor: String,
  videoUrl: String,
  status: { type: String, default: "active" }
});

const Training = mongoose.model('Training', TrainingSchema);

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/react_collage');
    console.log("Connected to MongoDB...");

    // Clear existing Java trainings to avoid duplicates
    await Training.deleteMany({ subject: "Java" });

    const javaCourse = new Training({
      title: "Java Full Stack Masterclass",
      subject: "Java",
      description: "Master Core Java, Spring Boot, and Hibernate from scratch with industry projects.",
      duration: "4 Weeks",
      startDate: new Date().toLocaleDateString(),
      price: 1500,
      language: "English",
      level: "Intermediate",
      instructor: "Dr. Kiran Patel",
      // Adding a dummy video to make the "Start Module" experience complete
      videoUrl: "/uploads/java_intro.mp4", 
      syllabus: [
        { 
          week: 1, 
          title: "Core Java & OOP Principles", 
          description: "Understanding JVM architecture, data types, and the 4 pillars of OOP: Encapsulation, Inheritance, Polymorphism, and Abstraction.", 
          lessons: 4,
          pdfUrl: "/uploads/java_week1.pdf" // Placeholder for the notes I generated
        },
        { 
          week: 2, 
          title: "Spring Framework Fundamentals", 
          description: "Introduction to IoC, Dependency Injection, Bean Lifecycles, and Spring Annotations.", 
          lessons: 5 
        },
        { 
          week: 3, 
          title: "Building RESTful Web Services", 
          description: "Developing robust APIs using Spring Boot, @RestController, Request Handling, and Global Exception Management.", 
          lessons: 6 
        },
        { 
          week: 4, 
          title: "Database & Final Project", 
          description: "Data persistence with Spring Data JPA, Hibernate, and building a full-scale Training Management System.", 
          lessons: 3 
        }
      ]
    });

    await javaCourse.save();
    console.log("✅ Java Full Stack Masterclass (With Video & PDF) seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedData();
