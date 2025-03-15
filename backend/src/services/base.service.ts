import { Document } from 'mongoose';
import { BaseRepository } from '../repositories/base.repository';
import { BaseEntity, CreateEntity, UpdateEntity } from '../interfaces/entity.interface';
import { IBaseService } from '../interfaces/service.interface';
import { Mapper } from '../utils/mapper.util';

export abstract class BaseService<T extends BaseEntity> implements IBaseService<T> {
  constructor(protected readonly repository: BaseRepository<Document>) {}

  async findById(id: string): Promise<T> {
    const doc = await this.repository.findById(id);
    return Mapper.toEntity<T>(doc);
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    const docs = await this.repository.find(filter as any);
    return docs.map(doc => Mapper.toEntity<T>(doc));
  }

  async create(data: CreateEntity<T>): Promise<T> {
    const doc = await this.repository.create(data as any);
    return Mapper.toEntity<T>(doc);
  }

  async update(id: string, data: UpdateEntity<T>): Promise<T> {
    const doc = await this.repository.update(id, data as any);
    return Mapper.toEntity<T>(doc);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const doc = await this.repository.findOne(filter as any);
    return doc ? Mapper.toEntity<T>(doc) : null;
  }

  async exists(filter: Partial<T>): Promise<boolean> {
    return this.repository.exists(filter as any);
  }

  protected async executeWithErrorHandling<R>(
    operation: () => Promise<R>,
    errorMessage: string
  ): Promise<R> {
    try {
      return await operation();
    } catch (error: any) {
      throw error;
    }
  }
} 