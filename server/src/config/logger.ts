import winston from 'winston';
import path from 'path';
import { env } from './env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  const base = `[${timestamp}] ${level}: ${message}`;
  return stack ? `${base}\n${stack}` : base;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      consoleFormat,
    ),
  }),
];

// Write logs to files in production
if (env.isProduction) {
  const logsDir = path.resolve(__dirname, '../../logs');

  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  );
}

export const logger = winston.createLogger({
  level: env.isDevelopment ? 'debug' : 'info',
  defaultMeta: { service: 'bhagalpur-resham-api' },
  transports,
  exceptionHandlers: [
    new winston.transports.Console(),
  ],
  rejectionHandlers: [
    new winston.transports.Console(),
  ],
});
