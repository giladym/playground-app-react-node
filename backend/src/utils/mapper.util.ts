import { Document } from 'mongoose';
import { BaseEntity } from '../interfaces/entity.interface';

export class Mapper {
  static toEntity<T extends BaseEntity>(doc: Document): T {
    const { _id, createdAt, updatedAt, ...rest } = doc.toObject();
    return {
      id: _id.toString(),
      createdAt,
      updatedAt,
      ...rest
    } as T;
  }

  static toDocument<T extends BaseEntity>(entity: Partial<T>): Record<string, any> {
    const { id, ...rest } = entity;
    return {
      ...(id && { _id: id }),
      ...rest
    };
  }
} 