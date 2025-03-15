import { BaseRepository } from './base.repository';
import { OrganizationModel, OrganizationDocument } from '../models/organization.model';
import { 
  OrganizationStatus, 
  CreateOrganizationRequest, 
  UpdateOrganizationRequest,
  UpdateOrganizationStatusRequest,
  AddMemberResponse
} from '../interfaces/organization.interface';
import { ProfileModel, ProfileDocument } from '../models/profile.model';
import { Types, UpdateQuery } from 'mongoose';

export class OrganizationRepository extends BaseRepository<OrganizationDocument> {
  constructor() {
    super(OrganizationModel);
  }

  async findActive(): Promise<OrganizationDocument[]> {
    return this.find({ status: OrganizationStatus.Active });
  }

  async updateStatus(id: string, { status }: UpdateOrganizationStatusRequest): Promise<OrganizationDocument> {
    return super.update(id, { status } as UpdateQuery<OrganizationDocument>);
  }

  async getMembers(organizationId: string): Promise<{
    organization: OrganizationDocument | null;
    members: ProfileDocument[];
  }> {
    const organization = await this.findById(organizationId);
    if (!organization) return { organization: null, members: [] };

    const members = await ProfileModel.find({ organizationId: new Types.ObjectId(organizationId) });
    return { organization, members };
  }

  async addMember(organizationId: string, userId: string): Promise<AddMemberResponse> {
    const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!profile) {
      return {
        success: false,
        message: 'Profile not found',
      };
    }

    profile.organizationId = new Types.ObjectId(organizationId);
    await profile.save();

    return {
      success: true,
      message: 'Member added successfully',
      profile
    };
  }

  async removeMember(organizationId: string, userId: string): Promise<boolean> {
    const profile = await ProfileModel.findOne({
      userId: new Types.ObjectId(userId),
      organizationId: new Types.ObjectId(organizationId)
    });
    
    if (!profile) return false;

    profile.organizationId = undefined;
    await profile.save();
    return true;
  }

  async createOrganization(data: CreateOrganizationRequest): Promise<OrganizationDocument> {
    const organizationData = {
      ...data,
      status: OrganizationStatus.Active,
      memberIds: []
    };
    return this.create(organizationData);
  }

  override async update(id: string, data: UpdateOrganizationRequest): Promise<OrganizationDocument> {
    return super.update(id, data as UpdateQuery<OrganizationDocument>);
  }
} 