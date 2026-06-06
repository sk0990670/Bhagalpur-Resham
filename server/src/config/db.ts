import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

const RECONNECT_INTERVAL = 5000;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.db.uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      // Critical for serverless: don't buffer commands if not connected
      bufferCommands: false,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnect...');
      scheduleReconnect();
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB error: ${err.message}`);
    });
  } catch (error) {
    logger.error(`MongoDB connection failed: ${(error as Error).message}`);
    scheduleReconnect();
  }
};

const scheduleReconnect = () => {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    logger.info('Retrying MongoDB connection...');
    await connectDB();
  }, RECONNECT_INTERVAL);
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
};
