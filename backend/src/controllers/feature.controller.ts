import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { FeatureDocument } from '../models/feature.model';
import { FeatureService } from '../services/feature.service';
import { CreateFeatureRequest, UpdateFeatureRequest, UpdateFeatureStatusRequest, UpdateFeatureConfigRequest } from '../interfaces/feature.interface';

export class FeatureController extends BaseController<FeatureDocument> {
  constructor(private readonly featureService: FeatureService) {
    super(featureService);
  }

  getActiveFeatures = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const features = await this.featureService.findActive();
      return { data: features };
    });
  };

  getFeaturesByType = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const type = req.params.type;
      const features = await this.featureService.findByType(type);
      return { data: features };
    });
  };

  createFeature = async (req: Request<{}, {}, CreateFeatureRequest>, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const feature = await this.featureService.create(req.body);
      return { data: feature };
    });
  };

  updateFeature = async (req: Request<{ id: string }, {}, UpdateFeatureRequest>, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const feature = await this.featureService.update(req.params.id, req.body);
      return { data: feature };
    });
  };

  updateStatus = async (req: Request<{ id: string }, {}, UpdateFeatureStatusRequest>, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const feature = await this.featureService.updateStatus(req.params.id, req.body);
      return { data: feature };
    });
  };

  updateConfig = async (req: Request<{ id: string }, {}, UpdateFeatureConfigRequest>, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const feature = await this.featureService.updateConfig(req.params.id, req.body);
      return { data: feature };
    });
  };
} 