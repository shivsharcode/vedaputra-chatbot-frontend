const chatbotButton = document.getElementById('chatbot-button');
const chatFirstContainer = document.getElementById('chat-first-container');
const chatSecondContainer = document.getElementById('chat-second-container');
const closeButtons = document.querySelectorAll('#close-button');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const resultsDiv = document.getElementById('results');

// Show the main chatbot menu when the chatbot button is clicked
chatbotButton.addEventListener('click', () => {
    chatFirstContainer.style.display = 'block';
    chatSecondContainer.style.display = 'none';
});

// Close both chatbot containers when any close button is clicked
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        chatFirstContainer.style.display = 'none';
        chatSecondContainer.style.display = 'none';
    });
});

// Show chat interface when "Talk to Vedputra" is clicked
function chatWithAI() {
    chatFirstContainer.style.display = 'none';
    chatSecondContainer.style.display = 'block';
    if (chatInput) chatInput.focus();
}


// Send message and get response (simulated)
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message === '') return;

    displayMessage(message, 'user');
    chatInput.value = '';
    chatInput.focus();
    askAI(message);
});

// Handle Enter key press in input field
chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

// Display message in chat window
function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender + '-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

// Modified to allow continuous appending to the same message
function createBotMessageElement() {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');
    messageElement.innerHTML = ''; // will be rendered as HTML
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageElement;
}

async function askAI(message) {
    const query = message;
    // const response = await fetch("https://vedaputra-backend.onrender.com/chat", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({ query })
    // });

    const response = await fetch("https://vedaputra-backend.onrender.com/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Create one message box for the bot's response
    const botMessageElement = createBotMessageElement();

    let rawMarkdown = '';  // accumulate all chunks as markdown

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        rawMarkdown += chunk;

        botMessageElement.innerHTML = marked.parse(rawMarkdown);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll with new content
    }
}

// Expose functions to global scope for inline onclick
window.recommendBlogs = recommendBlogs;
window.recommendBooks = recommendBooks;
window.chatWithAI = chatWithAI;
