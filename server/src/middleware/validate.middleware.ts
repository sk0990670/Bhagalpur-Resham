import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Factory that returns Express middleware validating req[target] against a Zod schema.
 * On failure, forwards a structured 422 ApiError.
 */
export const validate =
  (schema: ZodSchema, target: ValidateTarget = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(ApiError.unprocessable('Validation failed', errors));
    }

    // Overwrite with coerced/transformed data
    if (target === 'body') {
      req.body = result.data;
    } else {
      Object.assign(req[target], result.data);
    }
    next();
  };
