import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import type { Role } from '../utils/constants';

/**
 * Role-based access control guard.
 * Must be used AFTER the authenticate middleware.
 *
 * @param allowedRoles - One or more roles that are permitted
 *
 * @example
 * router.delete('/:id', authenticate, authorize('admin', 'superadmin'), handler)
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        ),
      );
    }

    next();
  };
};

/**
 * Ensures the authenticated user can only access their own resources,
 * unless they are an admin/superadmin.
 *
 * @param getResourceUserId - Function that extracts the owner userId from the request
 */
export const authorizeOwnerOrAdmin = (
  getResourceUserId: (req: Request) => string,
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const resourceUserId = getResourceUserId(req);
    const isOwner = req.user.userId === resourceUserId;
    const isAdminOrAbove = ['admin', 'superadmin'].includes(req.user.role);

    if (!isOwner && !isAdminOrAbove) {
      return next(ApiError.forbidden('You do not have permission to access this resource'));
    }

    next();
  };
};
