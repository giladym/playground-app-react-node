import { BaseService } from './base.service';
import { Feature } from '../interfaces/feature.interface';
import { FeatureDocument } from '../models/feature.model';
import { FeatureRepository } from '../repositories/feature.repository';
import { 
  CreateFeatureRequest, 
  UpdateFeatureRequest, 
  UpdateFeatureStatusRequest, 
  UpdateFeatureConfigRequest 
} from '../interfaces/feature.interface';
import { Mapper } from '../utils/mapper.util';

export class FeatureService extends BaseService<Feature, FeatureDocument> {
  constructor(private readonly featureRepository: FeatureRepository) {
    super(featureRepository);
  }

  async findActive(): Promise<Feature[]> {
    const docs = await this.featureRepository.findActive();
    return docs.map(doc => Mapper.toEntity<Feature>(doc));
  }

  async findByType(type: string): Promise<Feature[]> {
    const docs = await this.featureRepository.findByType(type);
    return docs.map(doc => Mapper.toEntity<Feature>(doc));
  }

  async updateStatus(id: string, data: UpdateFeatureStatusRequest): Promise<Feature> {
    const doc = await this.featureRepository.updateStatus(id, data);
    return Mapper.toEntity<Feature>(doc);
  }

  async updateConfig(id: string, data: UpdateFeatureConfigRequest): Promise<Feature> {
    const doc = await this.featureRepository.updateConfig(id, data);
    return Mapper.toEntity<Feature>(doc);
  }

  override async create(data: CreateFeatureRequest): Promise<Feature> {
    const doc = await this.featureRepository.createFeature(data);
    return Mapper.toEntity<Feature>(doc);
  }

  override async update(id: string, data: UpdateFeatureRequest): Promise<Feature> {
    const doc = await this.featureRepository.update(id, data);
    return Mapper.toEntity<Feature>(doc);
  }
} 