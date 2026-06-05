# DocuMind AI 📄🤖

**DocuMind AI** is a modern, high-performance RAG (Retrieval-Augmented Generation) assistant that allows users to upload PDF documents and have intelligent, context-aware conversations with them. 

Built with a stunning **Glassmorphism UI** and powered by **Google Gemini**, it provides precise answers by analyzing document segments in real-time.

---

## ✨ Features

- 💎 **Premium UI**: Sleek, modern design with dark mode and glass-inspired elements.
- 🧠 **RAG-Powered**: Uses vector similarity search to find the most relevant parts of your PDF.
- ⚡ **Google Gemini Integration**: Leverages the latest `gemini-1.5-flash` and `gemini-2.0` models.
- 📤 **Fast Processing**: Intelligent PDF chunking and internal vector storage for rapid retrieval.
- 📝 **Markdown Support**: Beautifully formatted AI responses including SQL code blocks, tables, and lists.
- 🛡️ **Stable Architecture**: Custom-built RAG engine bypassing common library bugs for 100% reliability.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+), [Marked.js](https://marked.js.org/)
- **Backend**: Node.js, Express
- **AI/ML**: Google Generative AI (Gemini), Gemini Embeddings
- **Tools**: Multer (File Uploads), PDF-Parse (Text Extraction)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
Clone the repository and install dependencies for the backend:
```bash
cd backend
npm install
```

### 3. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
GEMINI_API_KEY=your_api_key_here
```

### 4. Running the Project
**Start the Backend:**
```bash
cd backend
node server.js
```

**Start the Frontend:**
Simply open `frontend/index.html` in your browser or serve it using a local server (e.g., Live Server).

---

## 📖 Usage
1. Drag and drop any PDF into the upload zone.
2. Wait for the "Analysis complete" message.
3. Ask questions about the content (e.g., "Summarize this document" or "What is the answer to question 5?").
4. Enjoy perfectly formatted, context-aware answers!

---

## 👨‍💻 Developed By
**Nikhil Dasari** (Antigravity AI Assistant)

---

## 📄 License
MIT License - feel free to use this for your own learning and projects!
