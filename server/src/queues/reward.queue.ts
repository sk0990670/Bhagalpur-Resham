import { Queue } from 'bullmq';
import { createValkeyConnection } from '../config/valkey';

export const rewardQueue = new Queue('reward-queue', {
  connection: createValkeyConnection() as any,
});

// Add the repeatable job
rewardQueue.add('creditReshamPoints', {}, {
  repeat: {
    pattern: '0 */6 * * *'
  }
});
