import { BaseRepository } from './base.repository';
import { FeatureModel, FeatureDocument } from '../models/feature.model';
import { 
  FeatureStatus, 
  CreateFeatureRequest, 
  UpdateFeatureRequest, 
  UpdateFeatureStatusRequest, 
  UpdateFeatureConfigRequest 
} from '../interfaces/feature.interface';
import { UpdateQuery } from 'mongoose';

export class FeatureRepository extends BaseRepository<FeatureDocument> {
  constructor() {
    super(FeatureModel);
  }

  async findActive(): Promise<FeatureDocument[]> {
    return this.find({ status: FeatureStatus.Active });
  }

  async findByType(type: string): Promise<FeatureDocument[]> {
    return this.find({ type });
  }

  async updateStatus(id: string, { status }: UpdateFeatureStatusRequest): Promise<FeatureDocument> {
    return super.update(id, { status } as UpdateQuery<FeatureDocument>);
  }

  async updateConfig(id: string, { config }: UpdateFeatureConfigRequest): Promise<FeatureDocument> {
    return super.update(id, { config } as UpdateQuery<FeatureDocument>);
  }

  async createFeature(data: CreateFeatureRequest): Promise<FeatureDocument> {
    const featureData = {
      ...data,
      status: FeatureStatus.Active
    };
    return this.create(featureData);
  }

  override async update(id: string, data: UpdateFeatureRequest): Promise<FeatureDocument> {
    return super.update(id, data as UpdateQuery<FeatureDocument>);
  }
} 