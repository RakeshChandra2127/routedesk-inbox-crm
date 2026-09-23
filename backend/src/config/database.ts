import mongoose from 'mongoose';
import { config } from './index';
import { logger } from './logger';

export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
    mongoose.connection.on('error', (err) => logger.error(`MongoDB error: ${err}`));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

    await mongoose.connect(config.mongodbUri);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};
