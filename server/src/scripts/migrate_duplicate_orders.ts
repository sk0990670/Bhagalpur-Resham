import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import { Order } from '../models/order.model';
import { env } from '../config/env';

async function migrateDuplicates() {
  try {
    await mongoose.connect(env.db.uri);
    console.log('Connected to MongoDB');

    // Fetch all orders
    const allOrders = await Order.find().sort({ createdAt: 1 }).lean();
    console.log(`Found ${allOrders.length} total orders.`);

    const userCartMap = new Map<string, any[]>();

    for (const order of allOrders) {
      if (order.status === 'cancelled') continue;

      const userId = order.user.toString();
      if (!userCartMap.has(userId)) {
        userCartMap.set(userId, []);
      }
      userCartMap.get(userId)!.push(order);
    }

    let duplicateCount = 0;

    for (const [userId, userOrders] of userCartMap.entries()) {
      // Group orders by exact items match within a 2-hour window
      const groups: any[][] = [];

      for (const order of userOrders) {
        let matchedGroup = groups.find(group => {
          const firstOrder = group[0];
          
          // Check time window (e.g., 2 hours)
          const timeDiff = Math.abs(new Date(order.createdAt).getTime() - new Date(firstOrder.createdAt).getTime());
          const isWithinWindow = timeDiff <= 2 * 60 * 60 * 1000;

          // Check identical items
          const itemsMatch = order.items.length === firstOrder.items.length && order.items.every((item: any, index: number) => {
            return item.product.toString() === firstOrder.items[index].product.toString() && item.qty === firstOrder.items[index].qty;
          });

          return isWithinWindow && itemsMatch;
        });

        if (matchedGroup) {
          matchedGroup.push(order);
        } else {
          groups.push([order]);
        }
      }

      // For each group with more than 1 order, keep the valid one and cancel others
      for (const group of groups) {
        if (group.length > 1) {
          // Sort by createdAt ascending
          group.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

          // Find if any order is already paid/confirmed
          let primaryOrder = group.find(o => o.status !== 'pending_verification' && o.status !== 'cancelled');
          
          // If no paid order, keep the oldest one
          if (!primaryOrder) {
            primaryOrder = group[0];
          }

          console.log(`Group of ${group.length} duplicates found for user ${userId}. Primary: ${primaryOrder.orderId}`);

          // Cancel others
          for (const duplicate of group) {
            if (duplicate._id.toString() !== primaryOrder._id.toString()) {
              console.log(`Cancelling duplicate: ${duplicate.orderId}`);
              await Order.updateOne(
                { _id: duplicate._id },
                { 
                  $set: { 
                    status: 'cancelled', 
                    cancellationReason: 'MERGED_DUPLICATE',
                    cancelledAt: new Date()
                  },
                  $push: {
                    statusHistory: {
                      status: 'cancelled',
                      timestamp: new Date(),
                      note: 'Cancelled as merged duplicate during migration'
                    }
                  }
                }
              );
              duplicateCount++;
            }
          }
        }
      }
    }

    console.log(`Migration complete. Cancelled ${duplicateCount} duplicate orders.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateDuplicates();
