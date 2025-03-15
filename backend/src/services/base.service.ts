import { Document } from 'mongoose';
import { BaseRepository } from '../repositories/base.repository';
import { BaseEntity, CreateEntity, UpdateEntity } from '../interfaces/entity.interface';
import { IBaseService } from '../interfaces/service.interface';
import { Mapper } from '../utils/mapper.util';

export abstract class BaseService<T extends BaseEntity, D extends Document = Document> implements IBaseService<T> {
  constructor(protected readonly repository: BaseRepository<D>) {}

  async findById(id: string): Promise<T> {
    const doc = await this.repository.findById(id);
    return Mapper.toEntity<T>(doc);
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    const docs = await this.repository.find(Mapper.toDocument(filter));
    return docs.map(doc => Mapper.toEntity<T>(doc));
  }

  async create(data: CreateEntity<T>): Promise<T> {
    const doc = await this.repository.create(data);
    return Mapper.toEntity<T>(doc);
  }

  async update(id: string, data: UpdateEntity<T>): Promise<T> {
    const doc = await this.repository.update(id, Mapper.toDocument(data));
    return Mapper.toEntity<T>(doc);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const doc = await this.repository.findOne(Mapper.toDocument(filter));
    return doc ? Mapper.toEntity<T>(doc) : null;
  }

  async exists(filter: Partial<T>): Promise<boolean> {
    return this.repository.exists(Mapper.toDocument(filter));
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