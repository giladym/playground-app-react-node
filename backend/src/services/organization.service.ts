import { BaseService } from './base.service';
import { OrganizationDocument } from '../models/organization.model';
import { Organization, OrganizationStatus, CreateOrganizationRequest, UpdateOrganizationRequest, UpdateOrganizationStatusRequest, AddMemberResponse } from '../interfaces/organization.interface';
import { NotFoundError } from '../utils/errors';
import { OrganizationRepository } from '../repositories/organization.repository';

export class OrganizationService extends BaseService<Organization, OrganizationDocument> {
  constructor(private readonly organizationRepository: OrganizationRepository) {
    super(organizationRepository);
  }

  async findActive(): Promise<Organization[]> {
    return this.find({ status: OrganizationStatus.Active });
  }

  async updateStatus(id: string, { status }: UpdateOrganizationStatusRequest): Promise<Organization> {
    const organization = await this.findById(id);
    if (!organization) {
      throw new NotFoundError(`Organization with id ${id} not found`);
    }
    return this.organizationRepository.updateStatus(id, { status });
  }

  async getMembers(organizationId: string) {
    const organization = await this.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(`Organization with id ${organizationId} not found`);
    }

    const { members } = await this.organizationRepository.getMembers(organizationId);
    return {
      organization,
      members
    };
  }

  async addMember(organizationId: string, userId: string): Promise<AddMemberResponse> {
    const organization = await this.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(`Organization with id ${organizationId} not found`);
    }

    const result = await this.organizationRepository.addMember(organizationId, userId);
    if (!result.success) {
      throw new NotFoundError(`Profile for user ${userId} not found`);
    }

    return result;
  }

  async removeMember(organizationId: string, userId: string): Promise<void> {
    const organization = await this.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(`Organization with id ${organizationId} not found`);
    }

    const success = await this.organizationRepository.removeMember(organizationId, userId);
    if (!success) {
      throw new NotFoundError(`Profile not found for user ${userId} in organization ${organizationId}`);
    }
  }

  override async create(data: CreateOrganizationRequest): Promise<Organization> {
    const organizationData = {
      ...data,
      status: OrganizationStatus.Active,
      memberIds: []
    };
    return super.create(organizationData);
  }

  override async update(id: string, data: UpdateOrganizationRequest): Promise<Organization> {
    const organization = await this.findById(id);
    if (!organization) {
      throw new NotFoundError(`Organization with id ${id} not found`);
    }
    return super.update(id, data);
  }
} 