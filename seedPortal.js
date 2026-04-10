const mongoose = require("mongoose");
const Company = require("./models/Company");
const Job = require("./models/Job");

mongoose.connect("mongodb://127.0.0.1:27017/react_collage")
.then(async () => {
    console.log("Seeding Data...");
    
    // Clear existing
    await Company.deleteMany({});
    await Job.deleteMany({});

    const companies = await Company.insertMany([
        { name: "Google", sector: "Technology", location: "Mountain View, CA" },
        { name: "Microsoft", sector: "Software", location: "Redmond, WA" },
        { name: "TCS", sector: "IT Services", location: "Mumbai, India" },
        { name: "Infosys", sector: "Consulting", location: "Bangalore, India" },
        { name: "Amazon", sector: "E-commerce", location: "Seattle, WA" },
        { name: "Meta", sector: "Social Media", location: "Menlo Park, CA" },
        { name: "Netflix", sector: "Entertainment", location: "Los Gatos, CA" },
        { name: "Apple", sector: "Electronics", location: "Cupertino, CA" }
    ]);

    await Job.insertMany([
        { 
            title: "Frontend Developer", 
            companyId: companies[0]._id, 
            salary: "12 LPA", 
            eligibility: "B.Tech (CSE/IT)", 
            deadline: new Date("2026-03-30") 
        },
        { 
            title: "Software Engineer", 
            companyId: companies[1]._id, 
            salary: "15 LPA", 
            eligibility: "B.Tech/MCA", 
            deadline: new Date("2026-04-15") 
        },
        { 
            title: "System Engineer", 
            companyId: companies[2]._id, 
            salary: "7 LPA", 
            eligibility: "Any Graduate", 
            deadline: new Date("2026-03-25") 
        },
        { 
            title: "Cloud Architect", 
            companyId: companies[4]._id, 
            salary: "20 LPA", 
            eligibility: "B.Tech/M.Tech", 
            deadline: new Date("2026-05-10") 
        },
        { 
            title: "Full Stack Developer", 
            companyId: companies[5]._id, 
            salary: "18 LPA", 
            eligibility: "B.Tech/MCA", 
            deadline: new Date("2026-04-20") 
        },
        { 
            title: "UI Designer", 
            companyId: companies[6]._id, 
            salary: "14 LPA", 
            eligibility: "Any Graduate", 
            deadline: new Date("2026-04-30") 
        },
        { 
            title: "Hardware Engineer", 
            companyId: companies[7]._id, 
            salary: "16 LPA", 
            eligibility: "B.Tech (ECE/CSE)", 
            deadline: new Date("2026-05-05") 
        }
    ]);

    console.log("Seeding Successful! ✅");
    process.exit();
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
