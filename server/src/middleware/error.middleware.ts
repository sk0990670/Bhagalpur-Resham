import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  let error = err;

  // Log every error
  logger.error({
    message: err.message,
    stack: env.isDevelopment ? err.stack : undefined,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error = ApiError.badRequest('Invalid resource ID format');
  }

  // Handle Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).code === '11000') {
    const keyValue = (err as unknown as { keyValue: Record<string, unknown> }).keyValue;
    const field = Object.keys(keyValue)[0];
    error = ApiError.conflict(`${field} already exists`);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(
      (err as mongoose.Error.ValidationError).errors,
    ).map((e) => ({ field: e.path, message: e.message }));
    error = ApiError.unprocessable('Validation failed', errors);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token has expired');
  }

  // Final response
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors.length > 0 ? error.errors : undefined,
      stack: env.isDevelopment ? error.stack : undefined,
    });
    return;
  }

  // Unknown error fallback
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'An unexpected error occurred',
    stack: env.isDevelopment ? err.stack : undefined,
  });
};
