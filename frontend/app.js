const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const fileNameDisplay = document.getElementById('file-name');
const fileSizeDisplay = document.getElementById('file-size');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let currentFile = null;

// File Upload Logic
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        handleFile(files[0]);
    } else {
        alert('Please upload a valid PDF file.');
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

async function handleFile(file) {
    currentFile = file;
    fileNameDisplay.textContent = file.name;
    fileSizeDisplay.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    fileInfo.style.display = 'block';
    
    addMessage('ai', `Uploading and analyzing "${file.name}"... Please wait.`);

    // --- REAL UPLOAD ---
    const formData = new FormData();
    formData.append('pdf', file);

    try {
        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        // Enable chat
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();

        addMessage('ai', `Analysis complete! I've internalized the document. What would you like to know about it?`);
    } catch (error) {
        console.error('Upload error:', error);
        addMessage('ai', 'Error: Could not connect to the backend server. Make sure it is running on port 5000.');
    }
}

// Chat Logic
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    if (sender === 'ai' && typeof marked !== 'undefined') {
        messageDiv.innerHTML = marked.parse(text);
    } else {
        messageDiv.textContent = text;
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Smooth scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    userInput.value = '';
    
    // Show AI "thinking" state
    const thinkingMessage = document.createElement('div');
    thinkingMessage.classList.add('message', 'ai');
    thinkingMessage.textContent = '...Analyzing...';
    chatMessages.appendChild(thinkingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // --- REAL BACKEND INTEGRATION ---
    try {
        const response = await fetch('http://localhost:5000/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: text })
        });
        const data = await response.json();
        
        if (chatMessages.contains(thinkingMessage)) {
            chatMessages.removeChild(thinkingMessage);
        }
        addMessage('ai', data.answer);
    } catch (error) {
        console.error('Error:', error);
        if (chatMessages.contains(thinkingMessage)) {
            chatMessages.removeChild(thinkingMessage);
        }
        addMessage('ai', 'Thinking... Actually, I having trouble reaching my brain (server). Check your connection!');
    }
}

sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});
