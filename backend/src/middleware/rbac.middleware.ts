import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../utils/app-error';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Not authenticated', 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role) && req.user.role !== 'super_admin') {
      return next(new AppError(403, 'Forbidden', 'FORBIDDEN'));
    }

    next();
  };
};
