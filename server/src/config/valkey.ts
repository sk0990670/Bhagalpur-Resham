import { Redis } from 'ioredis';
import { env } from './env';

const valkeyUrl = env.valkeyUrl;

const redisConfig = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// Create a persistent Valkey connection for general operations and cache
export const valkeyClient = new Redis(valkeyUrl, redisConfig);

// BullMQ requires a separate connection for workers
export const createValkeyConnection = () => new Redis(valkeyUrl, redisConfig);

valkeyClient.on('connect', () => {
  console.log('✅ Connected to Valkey (Upstash)');
});

valkeyClient.on('error', (err) => {
  console.error('❌ Valkey connection error:', err);
});
