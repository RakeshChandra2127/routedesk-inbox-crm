import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { connectDB } from './config/database';
import { logger } from './config/logger';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';
import { socketService } from './websocket';
import { startWorkers, stopWorkers } from './queues';
import mongoose from 'mongoose';
import { cacheClient, queueClient } from './config/redis';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Initialization
const start = async () => {
  try {
    await connectDB();
    socketService.init(httpServer);
    startWorkers();

    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down server...');
  httpServer.close();
  socketService.close();
  await stopWorkers();
  await mongoose.disconnect();
  await cacheClient.quit();
  await queueClient.quit();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

start();
