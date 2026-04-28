require("dotenv").config();
const mongoose = require("mongoose");
const Training = require("./models/Training");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/react_collage")
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // Clear existing trainings
    await Training.deleteMany({});
    console.log("🗑️  Cleared existing trainings");

    const trainings = [
      {
        title: "Java Full Stack Development",
        subject: "Java",
        description: "Master Core Java, Spring Boot, REST APIs, and React to become a job-ready full stack developer. Includes real-world projects, mock interviews, and placement support.",
        duration: "16 Weeks",
        startDate: "2026-05-01",
        price: 8000,
        language: "English",
        level: "Intermediate",
        instructor: "Prof. Rahul Sharma",
        status: "active",
        syllabus: [
          { week: 1, title: "Core Java Fundamentals", lessons: 8, description: "OOP, Collections, Exception Handling" },
          { week: 2, title: "Java Advanced Concepts", lessons: 6, description: "Multithreading, Streams, Lambda" },
          { week: 3, title: "Spring Boot Basics", lessons: 7, description: "REST APIs, Dependency Injection" },
          { week: 4, title: "Database Integration", lessons: 5, description: "JPA, Hibernate, MySQL" },
        ]
      },
      {
        title: "Python & Data Science Bootcamp",
        subject: "Python",
        description: "Learn Python from scratch and dive into Data Science with NumPy, Pandas, Matplotlib, and Machine Learning. Hands-on projects with real datasets.",
        duration: "12 Weeks",
        startDate: "2026-05-10",
        price: 7500,
        language: "English",
        level: "Beginner",
        instructor: "Dr. Priya Mehta",
        status: "active",
        syllabus: [
          { week: 1, title: "Python Fundamentals", lessons: 7, description: "Syntax, Data types, Functions" },
          { week: 2, title: "NumPy & Pandas", lessons: 6, description: "Data manipulation and analysis" },
          { week: 3, title: "Data Visualization", lessons: 5, description: "Matplotlib, Seaborn" },
          { week: 4, title: "Machine Learning Intro", lessons: 8, description: "Scikit-learn, Regression, Classification" },
        ]
      },
      {
        title: "React.js & Frontend Engineering",
        subject: "React",
        description: "Build modern, responsive web apps using React 18, Redux Toolkit, React Router, and REST API integration. Project-based learning with real deployments.",
        duration: "10 Weeks",
        startDate: "2026-05-15",
        price: 6500,
        language: "English",
        level: "Intermediate",
        instructor: "Mr. Aditya Kulkarni",
        status: "active",
        syllabus: [
          { week: 1, title: "React Basics & JSX", lessons: 6, description: "Components, Props, State" },
          { week: 2, title: "Hooks & Context", lessons: 7, description: "useState, useEffect, useContext" },
          { week: 3, title: "Router & Redux", lessons: 6, description: "React Router v6, Redux Toolkit" },
          { week: 4, title: "API Integration & Deployment", lessons: 5, description: "Axios, JWT Auth, Vercel deploy" },
        ]
      },
      {
        title: "PHP & Laravel Web Development",
        subject: "PHP",
        description: "From PHP basics to building enterprise-level web applications with the Laravel framework. Includes MVC, Eloquent ORM, Blade templating, and API development.",
        duration: "10 Weeks",
        startDate: "2026-06-01",
        price: 5500,
        language: "English",
        level: "Beginner",
        instructor: "Ms. Sneha Patil",
        status: "active",
        syllabus: [
          { week: 1, title: "PHP Fundamentals", lessons: 7, description: "Syntax, Arrays, Forms, Sessions" },
          { week: 2, title: "OOP in PHP", lessons: 6, description: "Classes, Interfaces, Traits" },
          { week: 3, title: "Laravel Framework", lessons: 8, description: "MVC, Routing, Middleware" },
          { week: 4, title: "Database & Deployment", lessons: 5, description: "Eloquent ORM, Migrations, cPanel" },
        ]
      },
      {
        title: "Node.js & Express Backend Mastery",
        subject: "NodeJS",
        description: "Build scalable server-side applications with Node.js, Express.js, MongoDB, and JWT authentication. Learn RESTful API design and microservices patterns.",
        duration: "8 Weeks",
        startDate: "2026-06-10",
        price: 6000,
        language: "English",
        level: "Intermediate",
        instructor: "Mr. Vikram Joshi",
        status: "active",
        syllabus: [
          { week: 1, title: "Node.js Core", lessons: 6, description: "Event loop, Modules, File system" },
          { week: 2, title: "Express & REST", lessons: 7, description: "Routing, Middleware, Error handling" },
          { week: 3, title: "MongoDB & Mongoose", lessons: 6, description: "Schema design, CRUD, Aggregation" },
          { week: 4, title: "Auth & Deployment", lessons: 5, description: "JWT, bcrypt, Railway/Render deploy" },
        ]
      },
      {
        title: "UI/UX Design with Figma",
        subject: "Design",
        description: "Learn professional UI/UX design principles using Figma. Create wireframes, prototypes, and design systems used by top tech companies. Portfolio-ready projects included.",
        duration: "6 Weeks",
        startDate: "2026-06-20",
        price: 4500,
        language: "English",
        level: "Beginner",
        instructor: "Ms. Ananya Singh",
        status: "active",
        syllabus: [
          { week: 1, title: "Design Fundamentals", lessons: 5, description: "Color theory, Typography, Grids" },
          { week: 2, title: "Figma Essentials", lessons: 6, description: "Components, Auto-layout, Variants" },
          { week: 3, title: "Wireframing & Prototyping", lessons: 5, description: "User flows, Interactions" },
          { week: 4, title: "Design System & Portfolio", lessons: 4, description: "Tokens, Style guides, Case study" },
        ]
      }
    ];

    await Training.insertMany(trainings);
    console.log(`✅ Seeded ${trainings.length} training modules successfully!`);
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
