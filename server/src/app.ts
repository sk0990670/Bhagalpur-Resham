import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { apiRateLimiter } from './middleware/rateLimiter.middleware';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './config/logger';

// Routes (will be added module by module)
import router from './routes';

const createApp = (): Application => {
  const app = express();

  // ── Security ──────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          callback(null, true);
        } else {
          callback(null, env.clientUrl);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // ── Compression ───────────────────────────────────────────
  app.use(compression());

  // ── Body Parsing ──────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // ── HTTP Logging ──────────────────────────────────────────
  if (env.isDevelopment) {
    app.use(morgan('dev'));
  } else {
    app.use(
      morgan('combined', {
        stream: { write: (message) => logger.http(message.trim()) },
      }),
    );
  }

  // ── Rate Limiting ─────────────────────────────────────────
  app.use('/api', apiRateLimiter);

  // ── Health Check ──────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // ── Swagger Docs ──────────────────────────────────────────
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Bhagalpur Resham API Docs',
      customCss: '.swagger-ui .topbar { background-color: #8b0000; }',
    }),
  );

  // ── API Routes ────────────────────────────────────────────
  app.use('/api', router);

  // ── 404 & Error Handlers ──────────────────────────────────
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};

export default createApp;
