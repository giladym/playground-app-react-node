import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';
import { UserRole } from '../interfaces/user.interface';

export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}; 