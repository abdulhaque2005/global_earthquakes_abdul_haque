import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
  });
  return io;
};

export const getSocketIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};
