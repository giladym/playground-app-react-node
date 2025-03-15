import { BaseRepository } from './base.repository';
import { UserModel, UserDocument } from '../models/user.model';
import { UpdateQuery } from 'mongoose';
import { RegisterRequest, UserRole } from '../interfaces/user.interface';

export class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super(UserModel);
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email })
      .select('+password')
      .exec();
  }

  async updateLastLogin(id: string): Promise<UserDocument> {
    return super.update(id, {
      lastLogin: new Date()
    } as UpdateQuery<UserDocument>);
  }

  async createUser(data: RegisterRequest): Promise<UserDocument> {
    const userData = {
      ...data,
      role: UserRole.USER,
      isEmailVerified: false
    };
    return this.create(userData);
  }
} 