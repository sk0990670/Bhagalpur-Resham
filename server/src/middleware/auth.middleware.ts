import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import { ApiError } from '../utils/ApiError';

/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches decoded payload to req.user.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access token is required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Optional authentication — attaches user if token present, otherwise continues.
 * Useful for public routes that have user-specific behavior when logged in.
 */
export const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        role: payload.role,
        email: payload.email,
      };
    } catch {
      // Token invalid — continue as unauthenticated
    }
  }

  next();
};
