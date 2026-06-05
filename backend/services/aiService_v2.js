const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const pdf = require('pdf-parse');

// --- Simple Text Splitter (Bypassing LangChain broken imports) ---
function simpleTextSplitter(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
        let end = i + chunkSize;
        chunks.push({ pageContent: text.substring(i, end) });
        i = i + (chunkSize - overlap);
        if (i >= text.length) break;
    }
    return chunks;
}

// --- Simple Vector Store Implementation ---
class SimpleVectorStore {
    constructor(embeddings) {
        this.embeddings = embeddings;
        this.documents = [];
        this.vectors = [];
    }

    static async fromDocuments(docs, embeddings) {
        const instance = new SimpleVectorStore(embeddings);
        instance.documents = docs;
        const texts = docs.map(doc => doc.pageContent);
        instance.vectors = await embeddings.embedDocuments(texts);
        return instance;
    }

    async similaritySearch(query, k = 4) {
        const queryVector = await this.embeddings.embedQuery(query);
        
        const scores = this.vectors.map((vector, index) => {
            let dotProduct = 0;
            for (let i = 0; i < vector.length; i++) {
                dotProduct += vector[i] * queryVector[i];
            }
            return { index, score: dotProduct };
        });

        scores.sort((a, b) => b.score - a.score);
        return scores.slice(0, k).map(s => this.documents[s.index]);
    }
}

let vectorStore = null;

/**
 * Processes a PDF file.
 */
async function processPDF(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const text = data.text;

        // Use our simple splitter
        const docs = simpleTextSplitter(text);
        
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GEMINI_API_KEY,
            modelName: "models/gemini-embedding-001",
        });

        // Use our custom stable implementation
        vectorStore = await SimpleVectorStore.fromDocuments(docs, embeddings);
        
        console.log(`Processed PDF: ${docs.length} chunks created.`);
        return true;
    } catch (error) {
        console.error("Error processing PDF:", error);
        throw error;
    }
}

/**
 * Answers a question.
 */
async function askQuestion(question) {
    if (!vectorStore) {
        throw new Error("No PDF loaded. Please upload a PDF first.");
    }

    const relevantDocs = await vectorStore.similaritySearch(question, 6);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });

    const prompt = `
        You are a helpful AI assistant. Use the following pieces of context extracted from a PDF to answer the question at the end.
        If you don't know the answer or the context doesn't contain it, just say that you don't know.
        
        Context:
        ${context}
        
        Question: ${question}
        
        Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini Response:", text);
    return text || "I was unable to find an answer in the document.";
}

module.exports = {
    processPDF,
    askQuestion
};
