import { Queue } from 'bullmq';
import { createValkeyConnection } from '../config/valkey';

export const productQueue = new Queue('product-queue', {
  connection: createValkeyConnection() as any,
});
