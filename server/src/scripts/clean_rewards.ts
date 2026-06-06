import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { Notification } from '../models/notification.model';
import { logger } from '../config/logger';

const cleanDatabase = async () => {
  try {
    await mongoose.connect(env.db.uri);
    logger.info('Connected to MongoDB.');

    // 1. Delete all Orders
    const orderResult = await Order.deleteMany({});
    logger.info(`Deleted ${orderResult.deletedCount} orders.`);

    // 2. Delete all Notifications
    const notificationResult = await Notification.deleteMany({});
    logger.info(`Deleted ${notificationResult.deletedCount} notifications.`);

    // 3. Reset Resham Points for all Users
    const userResult = await User.updateMany({}, { $set: { reshamPoints: 0, reshamPointsBalance: 0 } });
    logger.info(`Reset Resham Points for ${userResult.modifiedCount} users.`);

    logger.info('Database cleanup complete! Fresh start ready.');
    process.exit(0);
  } catch (error) {
    logger.error('Error cleaning database:', error);
    process.exit(1);
  }
};

cleanDatabase();
