import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';
import { BaseService } from '../services/base.service';
import { BaseEntity, CreateEntity, UpdateEntity } from '../interfaces/entity.interface';

export abstract class BaseController<T extends BaseEntity, D extends Document = Document> {
  constructor(protected readonly service: BaseService<T, D>) {}

  protected async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    action: () => Promise<any>
  ) {
    try {
      const result = await action();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const documents = await this.service.find();
      return { data: documents };
    });
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const document = await this.service.findById(req.params.id);
      return { data: document };
    });
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const createData = req.body as CreateEntity<T>;
      const document = await this.service.create(createData);
      return { data: document };
    });
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const updateData = req.body as UpdateEntity<T>;
      const document = await this.service.update(req.params.id, updateData);
      return { data: document };
    });
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      await this.service.delete(req.params.id);
      return { message: 'Document deleted successfully' };
    });
  };
} 