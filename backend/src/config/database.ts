import mongoose from 'mongoose';
import { config } from 'dotenv';
import logger from '../utils/logger';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/playground';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB Connected');
  } catch (err) {
    logger.error('MongoDB connection error:', { error: err });
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', { error: err });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    logger.error('Error closing MongoDB connection:', { error: err });
    process.exit(1);
  }
}); 