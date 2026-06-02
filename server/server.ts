import 'dotenv/config';
import createApp from './src/app';
import { connectDB, disconnectDB } from './src/config/db';
import { env } from './src/config/env';
import { logger } from './src/config/logger';

const startServer = async (): Promise<void> => {
  // Connect to MongoDB first
  await connectDB();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`📖 Swagger docs: http://localhost:${env.PORT}/api-docs`);
    logger.info(`❤️  Health check: http://localhost:${env.PORT}/health`);
  });

  // ── Graceful Shutdown ───────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      logger.info('Process exiting');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', reason);
    shutdown('unhandledRejection');
  });
};

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
