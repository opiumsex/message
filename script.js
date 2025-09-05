const socket = io();

// Загрузка истории сообщений
fetch('/api/messages')
  .then(response => response.json())
  .then(messages => {
    messages.forEach(addMessageToChat);
  });

// Обработка новых сообщений
socket.on('receive_message', (data) => {
  addMessageToChat(data);
});

function sendMessage() {
  const userInput = document.getElementById('userInput');
  const messageInput = document.getElementById('messageInput');
  
  const user = userInput.value.trim();
  const text = messageInput.value.trim();
  
  if (!user || !text) {
    alert('Введите имя и сообщение');
    return;
  }
  
  // Отправка через WebSocket для мгновенной доставки
  socket.emit('send_message', { user, text, timestamp: new Date() });
  
  // Отправка на сервер для сохранения в БД
  fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user, text })
  });
  
  messageInput.value = '';
}

function addMessageToChat(message) {
  const messagesContainer = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  
  const timestamp = new Date(message.timestamp).toLocaleTimeString();
  
  messageElement.innerHTML = `
    <span class="user">${message.user}:</span>
    <span>${message.text}</span>
    <span class="timestamp">${timestamp}</span>
  `;
  
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Отправка сообщения по нажатию Enter
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});