import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import logger from './utils/logger';
import prisma from './config/database';
import redis from './config/redis';
import { Server as SocketIOServer } from 'socket.io';

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-restaurant', (restaurantId: string) => {
    socket.join(`restaurant-${restaurantId}`);
    logger.info(`Client ${socket.id} joined restaurant room: ${restaurantId}`);
  });

  socket.on('join-order', (orderId: string) => {
    socket.join(`order-${orderId}`);
    logger.info(`Client ${socket.id} joined order room: ${orderId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available to the app
app.set('io', io);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Test Redis connection
    await redis.ping();
    logger.info('Redis connected successfully');

    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    await redis.quit();
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
