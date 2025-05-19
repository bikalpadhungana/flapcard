const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// MySQL connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'flaapme_flap',
  password: 'GHemaOp12<3',
  database: 'flaapme_flap'
});


// Create tables (run this once or use migrations)
async function initializeDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chatId VARCHAR(255),
      senderId VARCHAR(255),
      senderName VARCHAR(255),
      content TEXT,
      timestamp DATETIME
    )
  `);
}
initializeDatabase();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a chat room
  socket.on('joinRoom', (chatId) => {
    socket.join(chatId);
    console.log(`${socket.id} joined room ${chatId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    const { chatId, senderId, senderName, content } = data;
    const timestamp = new Date();
    await db.query(
      'INSERT INTO messages (chatId, senderId, senderName, content, timestamp) VALUES (?, ?, ?, ?, ?)',
      [chatId, senderId, senderName, content, timestamp]
    );
    io.to(chatId).emit('message', { ...data, timestamp });
  });

  // WebRTC signaling
  socket.on('offer', (data) => socket.to(data.chatId).emit('offer', data));
  socket.on('answer', (data) => socket.to(data.chatId).emit('answer', data));
  socket.on('ice-candidate', (data) => socket.to(data.chatId).emit('ice-candidate', data));

  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

server.listen(5000, () => console.log('Server running on port 5000'));