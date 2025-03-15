import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginRequest, RegisterRequest, User } from '../interfaces/user.interface';
import { BaseController } from './base.controller';

export class AuthController extends BaseController<User> {
  constructor(private readonly authService: AuthService) {
    super(authService);
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const registerData = req.body as RegisterRequest;
      const result = await this.authService.register(registerData);
      return result;
    });
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const loginData = req.body as LoginRequest;
      const result = await this.authService.login(loginData);
      return result;
    });
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      if (!req.user) {
        throw new Error('User not found in request');
      }
      return { data: req.user };
    });
  };

  updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      if (!req.user || req.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const { userId } = req.params;
      const { role } = req.body;

      const updatedUser = await this.authService.updateUserRole(userId, role);
      return { data: updatedUser };
    });
  };
} 