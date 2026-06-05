const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Special internal method or just checking what's available
        console.log("Checking available models for your API key...");
        
        // This is a common pattern to check if the key works
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        console.log("Model 'gemini-1.5-flash' instance created. Testing a simple prompt...");
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log("SUCCESS! Model response:", response.text());
    } catch (error) {
        console.error("FAILED to access models:", error.message);
        if (error.status) console.error("Status:", error.status);
    }
}

listModels();
