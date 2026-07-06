import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './config/socket.js';
import setupEarthquakeSockets from './sockets/earthquake.socket.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });
connectDB();
const server = http.createServer(app);
const io = initSocket(server);
setupEarthquakeSockets(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
const gracefulShutdown = () => {
  console.log('Received termination signal. Closing HTTP server and database connections gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    import('mongoose').then((mongoose) => {
      mongoose.default.connection.close(false).then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });
  });
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
