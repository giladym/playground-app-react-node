import { BaseService } from './base.service';
import { ProfileModel } from '../models/profile.model';
import { Profile, CreateProfileRequest, UpdateProfileRequest } from '../interfaces/profile.interface';
import { Types } from 'mongoose';
import { NotFoundError } from '../utils/errors';

export class ProfileService extends BaseService<Profile> {
  constructor() {
    super(ProfileModel);
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.findOne({ userId: new Types.ObjectId(userId) });
    if (!profile) {
      throw new NotFoundError(`Profile for user ${userId} not found`);
    }
    return profile;
  }

  async findByOrganization(organizationId: string): Promise<Profile[]> {
    return this.find({ organizationId: new Types.ObjectId(organizationId) });
  }

  async updateImage(id: string, imageUrl: string): Promise<Profile> {
    const profile = await this.findById(id);
    if (!profile) {
      throw new NotFoundError(`Profile with id ${id} not found`);
    }
    return this.update(id, { imageUrl });
  }

  async updatePhone(id: string, phone: string): Promise<Profile> {
    const profile = await this.findById(id);
    if (!profile) {
      throw new NotFoundError(`Profile with id ${id} not found`);
    }
    return this.update(id, { phone });
  }

  async updateOrganization(id: string, organizationId: string): Promise<Profile> {
    const profile = await this.findById(id);
    if (!profile) {
      throw new NotFoundError(`Profile with id ${id} not found`);
    }
    return this.update(id, { organizationId: new Types.ObjectId(organizationId) });
  }

  override async create(data: CreateProfileRequest): Promise<Profile> {
    const profileData = {
      ...data,
      userId: new Types.ObjectId(data.userId),
      organizationId: data.organizationId ? new Types.ObjectId(data.organizationId) : undefined
    };
    return super.create(profileData);
  }

  override async update(id: string, data: UpdateProfileRequest): Promise<Profile> {
    const profile = await this.findById(id);
    if (!profile) {
      throw new NotFoundError(`Profile with id ${id} not found`);
    }
    return super.update(id, data);
  }
} 