const mongoose = require("mongoose");
const Company = require("./models/Company");
const Job = require("./models/Job");

mongoose.connect("mongodb://127.0.0.1:27017/react_collage")
.then(async () => {
    const compCount = await Company.countDocuments();
    const jobCount = await Job.countDocuments();
    console.log(`Companies: ${compCount}`);
    console.log(`Jobs: ${jobCount}`);
    process.exit();
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
