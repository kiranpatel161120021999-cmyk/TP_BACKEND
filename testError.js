require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testHistory() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        let history = [{role: "ai", text: "Hello User!"}];
        let formattedHistory = (history || []).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.unshift({ role: 'user', parts: [{ text: 'Hello' }] });
        }

        const chat = model.startChat({
            history: formattedHistory
        });

        const result = await chat.sendMessage("What jobs are available?");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Failed with error:", e.message);
    }
}

testHistory();
