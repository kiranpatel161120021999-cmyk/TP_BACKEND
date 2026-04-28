require("dotenv").config();
const https = require("https");
const fs = require("fs");

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            fs.writeFileSync("output_models.json", JSON.stringify(JSON.parse(data), null, 2), "utf-8");
            console.log("Wrote available models to output_models.json");
        });
    }).on('error', (e) => {
        fs.writeFileSync("output_models.json", "Failed to list models: " + e.message, "utf-8");
    });
}

listModels();

