import { BaseEntity, CreateEntity, UpdateEntity } from './entity.interface';

export interface IBaseService<T extends BaseEntity> {
  findById(id: string): Promise<T>;
  find(filter?: Partial<T>): Promise<T[]>;
  findOne(filter: Partial<T>): Promise<T | null>;
  create(data: CreateEntity<T>): Promise<T>;
  update(id: string, data: UpdateEntity<T>): Promise<T>;
  delete(id: string): Promise<void>;
  exists(filter: Partial<T>): Promise<boolean>;
} 