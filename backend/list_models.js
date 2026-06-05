const https = require('https');
require('dotenv').config();

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        console.log("--- AVAILABLE MODELS ---");
        if (json.models) {
            json.models.forEach(m => {
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("Error response:", json);
        }
    });
}).on('error', (err) => {
    console.error("Error: " + err.message);
});
