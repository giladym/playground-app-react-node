import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { ProfileDocument } from '../models/profile.model';
import { ProfileService } from '../services/profile.service';

export class ProfileController extends BaseController<ProfileDocument> {
  constructor(private readonly profileService: ProfileService) {
    super(profileService);
  }

  getByUserId = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.params.userId;
      const profile = await this.profileService.findByUserId(userId);
      return { data: profile };
    });
  };

  getByOrganization = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const organizationId = req.params.organizationId;
      const profiles = await this.profileService.findByOrganization(organizationId);
      return { data: profiles };
    });
  };

  updateImage = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const profileId = req.params.id;
      const { imageUrl } = req.body;
      const profile = await this.profileService.updateImage(profileId, imageUrl);
      return { data: profile };
    });
  };

  updatePhone = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const profileId = req.params.id;
      const { phone } = req.body;
      const profile = await this.profileService.updatePhone(profileId, phone);
      return { data: profile };
    });
  };

  updateOrganization = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const profileId = req.params.id;
      const { organizationId } = req.body;
      const profile = await this.profileService.updateOrganization(profileId, organizationId);
      return { data: profile };
    });
  };
} 