import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { AuthService } from '../services/auth.service';
import { User, UserRole } from '../interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const authService = new AuthService();

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const user = await authService.validateToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    const user = req.user as User;
    if (!roles.includes(user.role)) {
      return next(
        new ForbiddenError('You do not have permission to perform this action')
      );
    }

    next();
  };
};

const extractTokenFromHeader = (req: Request): string | undefined => {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}; 