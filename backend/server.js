const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { processPDF, askQuestion } = require('./services/aiService_v2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multi-part form-data configuration for PDF uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    try {
        await processPDF(req.file.path);
        res.json({ 
            message: 'File processed and internalized successfully', 
            filename: req.file.filename,
            originalName: req.file.originalname 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
});

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;
    try {
        const answer = await askQuestion(question);
        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to get answer' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
