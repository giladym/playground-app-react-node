import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { DatabaseError, NotFoundError } from '../utils/errors';

export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T> {
    try {
      const document = await this.model.findById(id);
      if (!document) {
        throw new NotFoundError(`Document with id ${id} not found`);
      }
      return document;
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Error finding document by id: ${error.message}`);
    }
  }

  async find(
    filter: FilterQuery<T> = {},
    options: QueryOptions = {}
  ): Promise<T[]> {
    try {
      return await this.model.find(filter, null, options);
    } catch (error: any) {
      throw new DatabaseError(`Error finding documents: ${error.message}`);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      return await this.model.create(data);
    } catch (error: any) {
      throw new DatabaseError(`Error creating document: ${error.message}`);
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T> {
    try {
      const document = await this.model.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      );
      if (!document) {
        throw new NotFoundError(`Document with id ${id} not found`);
      }
      return document;
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Error updating document: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const document = await this.model.findByIdAndDelete(id);
      if (!document) {
        throw new NotFoundError(`Document with id ${id} not found`);
      }
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Error deleting document: ${error.message}`);
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter);
    } catch (error: any) {
      throw new DatabaseError(`Error finding document: ${error.message}`);
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      return !!(await this.model.exists(filter));
    } catch (error: any) {
      throw new DatabaseError(`Error checking document existence: ${error.message}`);
    }
  }
} 