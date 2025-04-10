import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';

const setupChatSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
      io.to(room).emit('newMessage', { username: 'System', message: `User joined ${room}` });
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room);
      console.log(`User ${socket.id} left room: ${room}`);
      io.to(room).emit('newMessage', { username: 'System', message: `User left ${room}` });
    });

    socket.on('sendMessage', async (data) => {
      const { username, message, room } = data;

      try {
        const chat = new Chat({ username, message, room });
        await chat.save();

        // Emit the message only to the specified room
        io.to(room).emit('newMessage', chat);
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;