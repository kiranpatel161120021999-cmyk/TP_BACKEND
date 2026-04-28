const Job = require("../models/Job");
const Training = require("../models/Training");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatWithAI = async (req, res) => {
  try {
    const { message, history, userRole, userInfo } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      let mockText = "I'm currently in **Demo Mode** because the `GEMINI_API_KEY` is not set in the `.env` file. \n\n";
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes("course") || lowerMsg.includes("training")) {
        mockText += "We offer several premium courses: \n- **Java Full Stack Development**\n- **Python for Data Science**\n- **Cloud Computing (AWS/Azure)**\n- **MERN Stack Mastery**\n\nYou can find these in the 'Trainings' section!";
      } else if (lowerMsg.includes("job") || lowerMsg.includes("hiring")) {
        mockText += "Currently, there are **15+ active job drives**! Companies like **Google, Microsoft, and TCS** are looking for students. Check the 'All Jobs' tab for details.";
      } else {
        mockText += "How can I help you navigate the Training & Placement Portal today? You can ask about courses, jobs, or mock interviews!";
      }
      return res.json({ text: mockText });
    }

    // --- DATA FETCHING (RAG-LITE) ---
    // Fetch latest jobs and active training sessions to give the AI real context
    const [jobs, trainings] = await Promise.all([
      Job.find().sort({ postedDate: -1 }).limit(5),
      Training.find({ status: "active" }).limit(5)
    ]);

    const jobContext = jobs.map(j => `- **${j.title}** at ${j.location || "Multiple Locations"} (Salary: ${j.salary || "As per norms"})`).join("\n");
    const trainingContext = trainings.map(t => `- **${t.title}** (${t.subject}) - Duration: ${t.duration}`).join("\n");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-flash-latest as it is always supported and avoids version specific 404s
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: `
        You are "TAP-Assistant", a premium AI guide for the Training & Placement (T&P) Portal.
        
        PORTAL DATA (REAL-TIME):
        AVAILABLE JOBS:
        ${jobContext || "No active jobs at the moment."}
        
        AVAILABLE TRAININGS:
        ${trainingContext || "No upcoming training sessions at the moment."}
        
        USER CONTEXT:
        Role: ${userRole || "Guest"}
        Name: ${userInfo?.name || "User"}
        
        GUIDELINES:
        1. Use the REAL-TIME DATA provided above to answer questions about jobs and courses.
        2. Be professional, encouraging, and concise.
        3. Use Markdown (bold, lists) for readability.
        4. If asked about a user's specific application status, guide them to their dashboard.
      `
    });

    let formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Gemini strictly requires the first message in the history to be from a 'user'
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.unshift({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to get AI response. Please ensure your GEMINI_API_KEY is valid." });
  }
};
