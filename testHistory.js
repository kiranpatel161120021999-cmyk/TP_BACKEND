require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testHistory() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const testHistory = [
            { role: "model", parts: [{ text: "Hello Admin" }] }
        ];

        const chat = model.startChat({
            history: testHistory
        });

        const result = await chat.sendMessage("Who are the top hiring companies?");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Failed with error:", e.message);
    }
}

testHistory();
