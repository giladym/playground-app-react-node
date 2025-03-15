import { BaseRepository } from './base.repository';
import { ProfileModel, ProfileDocument } from '../models/profile.model';
import { Types, UpdateQuery } from 'mongoose';
import { 
  CreateProfileRequest, 
  UpdateProfileRequest,
  UpdateProfileImageRequest,
  UpdateProfilePhoneRequest,
  UpdateProfileOrganizationRequest
} from '../interfaces/profile.interface';

export class ProfileRepository extends BaseRepository<ProfileDocument> {
  constructor() {
    super(ProfileModel);
  }

  async findByUserId(userId: string): Promise<ProfileDocument | null> {
    return this.findOne({ userId: new Types.ObjectId(userId) });
  }

  async findByOrganization(organizationId: string): Promise<ProfileDocument[]> {
    return this.find({ organizationId: new Types.ObjectId(organizationId) });
  }

  async updateImage(id: string, { imageUrl }: UpdateProfileImageRequest): Promise<ProfileDocument> {
    return super.update(id, { imageUrl } as UpdateQuery<ProfileDocument>);
  }

  async updatePhone(id: string, { phone }: UpdateProfilePhoneRequest): Promise<ProfileDocument> {
    return super.update(id, { phone } as UpdateQuery<ProfileDocument>);
  }

  async updateOrganization(id: string, { organizationId }: UpdateProfileOrganizationRequest): Promise<ProfileDocument> {
    return super.update(id, {
      organizationId: organizationId ? new Types.ObjectId(organizationId) : undefined
    } as UpdateQuery<ProfileDocument>);
  }

  async createProfile(data: CreateProfileRequest): Promise<ProfileDocument> {
    const profileData = {
      ...data,
      userId: new Types.ObjectId(data.userId),
      organizationId: data.organizationId ? new Types.ObjectId(data.organizationId) : undefined
    };
    return this.create(profileData);
  }

  override async update(id: string, data: UpdateProfileRequest): Promise<ProfileDocument> {
    return super.update(id, data as UpdateQuery<ProfileDocument>);
  }
} 