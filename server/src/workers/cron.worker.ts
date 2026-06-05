import { orderRepository } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';
import { logger } from '../config/logger';

// Clean up pending orders older than 30 minutes
export const cleanupPendingOrders = async () => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    // Find orders that are pending and older than 30 mins
    // Since we don't have a direct query in repository for this, we'll fetch then filter or just do raw mongoose if accessible
    // Alternatively, we can use the Mongoose model directly
    const mongoose = require('mongoose');
    const Order = mongoose.model('Order');

    const expiredOrders = await Order.find({
      status: 'pending_verification',
      createdAt: { $lte: thirtyMinutesAgo }
    });

    if (expiredOrders.length > 0) {
      logger.info(`[Cron] Found ${expiredOrders.length} expired pending orders. Cancelling and releasing stock...`);
      
      for (const order of expiredOrders) {
        // Return stock
        for (const item of order.items) {
          await productRepository.updateStock(item.product.toString(), item.qty);
        }
        
        // Update order status
        order.status = 'cancelled';
        order.cancellationReason = 'Payment Timeout';
        order.cancelledAt = new Date();
        order.statusHistory.push({
          status: 'cancelled',
          timestamp: new Date(),
          note: 'Auto-cancelled due to payment timeout',
        });
        
        await order.save();
      }
      logger.info(`[Cron] Successfully processed ${expiredOrders.length} expired orders.`);
    }
  } catch (error) {
    logger.error('[Cron] Error cleaning up pending orders:', error);
  }
};

// Run every 5 minutes
setInterval(cleanupPendingOrders, 5 * 60 * 1000);

logger.info('🕒 Pending order cleanup cron worker initialized.');
