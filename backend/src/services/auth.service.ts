import jwt, { SignOptions } from 'jsonwebtoken';
import { User, LoginRequest, RegisterRequest, UserResponse, UserRole } from '../interfaces/user.interface';
import { UnauthorizedError, BadRequestError } from '../utils/errors';
import config from '../config/env.config';
import { BaseService } from './base.service';
import { UserRepository } from '../repositories/user.repository';
import { UserDocument } from '../models/user.model';
import { Mapper } from '../utils/mapper.util';

export class AuthService extends BaseService<User, UserDocument> {
  private userRepository: UserRepository;

  constructor() {
    const repository = new UserRepository();
    super(repository);
    this.userRepository = repository;
  }

  async register(data: RegisterRequest): Promise<{ user: UserResponse; token: string }> {
    console.log('Registration attempt with data:', data);
    const existingUser = await this.findOne({ email: data.email });
    console.log('Existing user found:', !!existingUser);
    
    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }

    console.log('Creating new user with role:', UserRole.USER);
    const user = await this.create({
      ...data,
      role: UserRole.USER,
      isEmailVerified: false,
    });
    console.log('User created:', user);

    const token = this.generateToken(user);
    console.log('Token generated');

    return {
      user: this.excludePassword(user),
      token,
    };
  }

  async login(credentials: LoginRequest): Promise<{ user: UserResponse; token: string }> {
    console.log('Login attempt for email:', credentials.email);
    const userDoc = await this.userRepository.findByEmailWithPassword(credentials.email);
    console.log('User found:', !!userDoc);
    
    if (!userDoc) {
      console.log('User not found');
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await userDoc.comparePassword(credentials.password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      throw new UnauthorizedError('Invalid email or password');
    }

    await this.userRepository.updateLastLogin(userDoc.id);
    const user = Mapper.toEntity<User>(userDoc);
    const token = this.generateToken(user);

    return {
      user: this.excludePassword(user),
      token,
    };
  }

  async validateToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      const user = await this.findById(decoded.id);
      
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }

  private generateToken(user: User): string {
    const options: SignOptions = {
      expiresIn: Number(config.jwtExpiresIn) || '1d'
    };

    return jwt.sign(
      { id: user.id },
      config.jwtSecret,
      options
    );
  }

  private excludePassword(user: User): UserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserRole(userId: string, role: UserRole): Promise<UserResponse> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.update(userId, { role });
    return this.excludePassword(updatedUser);
  }
} 