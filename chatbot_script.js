const chatbotButton = document.getElementById('chatbot-button');
        const chatContainer = document.getElementById('chat-container');
        const closeButton = document.getElementById('close-button');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        const chatMessages = document.getElementById('chat-messages');

        // Toggle chat window visibility
        chatbotButton.addEventListener('click', () => {
            if (chatContainer.style.display === 'none') {
                chatContainer.style.display = 'block'
            }
            else {
                chatContainer.style.display = 'none';
            }

            // chatContainer.style.display = chatContainer.style.display === 'none' ? 'block' : 'none';
        });

        closeButton.addEventListener('click', () => {
            chatContainer.style.display = 'none';
        });

        // Send message and get response (simulated)
        sendButton.addEventListener('click', () => {
            const message = chatInput.value.trim();
            console.log(message)
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

                // botMessageElement.textContent += chunk;
                botMessageElement.innerHTML = marked.parse(rawMarkdown);
                chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll with new content
            }
        }
