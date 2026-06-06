import { Worker, Job } from 'bullmq';
import { createValkeyConnection } from '../config/valkey';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import { Notification } from '../models/notification.model';
import { RewardTransaction } from '../models/reward-transaction.model';
import { logger } from '../config/logger';

export const rewardWorker = new Worker('reward-queue', async (job: Job) => {
  if (job.name === 'creditReshamPoints') {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const eligibleOrders = await Order.find({
        status: 'delivered',
        rewardCredited: false,
        deliveredAt: { $lte: sevenDaysAgo }
      }).populate('user');

      if (eligibleOrders.length > 0) {
        logger.info(`[RewardWorker] Found ${eligibleOrders.length} eligible orders for reward points.`);
        
        for (const order of eligibleOrders) {
          if (order.status !== 'delivered' || order.rewardCredited || order.rewardLocked) continue;

          // Duplicate Protection Check
          const existingTransaction = await RewardTransaction.findOne({ orderId: order._id, type: 'earned' });
          if (existingTransaction) continue;
          
          const pointsEarned = Math.floor((order.pricing?.total || 0) * 0.05);
          
          const user = await User.findById(order.user._id);
          if (user) {
            // Update user
            user.reshamPointsBalance = (user.reshamPointsBalance || 0) + pointsEarned;
            await user.save();
            
            // Create RewardTransaction
            await RewardTransaction.create({
              userId: user._id,
              orderId: order._id,
              points: pointsEarned,
              type: 'earned',
              reason: `Earned for Order ${order.orderId}`,
              creditedAt: new Date()
            });

            // Update order
            order.rewardCredited = true;
            order.rewardCreditedAt = new Date();
            order.rewardPointsEarned = pointsEarned;
            order.rewardLocked = true;
            await order.save();
            
            // Create notification
            await Notification.create({
              userId: user._id,
              title: 'Resham Points Credited',
              message: `${pointsEarned} Resham Points have been added to your account for Order ${order.orderId}.`,
              type: 'reward'
            });
            
            logger.info(`[RewardWorker] Credited ${pointsEarned} points to user ${user._id} for order ${order.orderId}`);
          }
        }
      }
    } catch (error) {
      logger.error('[RewardWorker] Error crediting reward points:', error);
      throw error;
    }
  }
}, { connection: createValkeyConnection() as any });

rewardWorker.on('failed', (job, err) => {
  logger.error(`[RewardWorker] Job ${job?.id} failed:`, err);
});

logger.info('🕒 Reward Points BullMQ worker initialized.');
