const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');
const typingIndicator = document.getElementById('typing-indicator');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message with fade and slide animation
    addMessage(message, 'user');
    userInput.value = '';
    
    // Show high-tech typing indicator
    typingIndicator.style.display = 'block';
    scrollToBottom();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        
        typingIndicator.style.display = 'none';
        addMessage(data.answer, 'bot');
        
    } catch (error) {
        typingIndicator.style.display = 'none';
        addMessage("Communication error. The neural link was interrupted.", 'bot');
    }
});

function addMessage(text, sender) {
    const div = document.createElement('div');
    // Bots come from bottom-left, users from bottom-right
    const animation = sender === 'user' ? 'animate__fadeInRight' : 'animate__fadeInUp';
    
    div.className = `msg msg-${sender} animate__animated ${animation}`;
    div.innerText = text;
    chatWindow.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: 'smooth'
    });
}

function sendQuick(text) {
    userInput.value = text;
    chatForm.dispatchEvent(new Event('submit'));
}