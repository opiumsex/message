const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const messageRoutes = require('./routes/messages');
const { initDb } = require('./config/database');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Инициализация БД
initDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/messages', messageRoutes);

// WebSocket обработчики
io.on('connection', (socket) => {
  console.log('Новый пользователь подключился:', socket.id);

  socket.on('send_message', async (data) => {
    try {
      // Сохраняем сообщение в БД
      const savedMessage = await Message.create(data);
      
      // Отправляем сообщение всем подключенным клиентам
      io.emit('receive_message', savedMessage);
    } catch (error) {
      console.error('Ошибка сохранения сообщения:', error);
      socket.emit('error', { message: 'Не удалось отправить сообщение' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});