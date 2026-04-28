require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function testAI() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("Success with gemini-pro!");
    } catch (e) {
        fs.writeFileSync("output_err.txt", "Failed with gemini-pro: " + e.message, "utf-8");
        console.log("Wrote error to output_err.txt");
    }
}

testAI();
