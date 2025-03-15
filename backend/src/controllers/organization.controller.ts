import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { OrganizationDocument } from '../models/organization.model';
import { OrganizationService } from '../services/organization.service';

export class OrganizationController extends BaseController<OrganizationDocument> {
  constructor(private readonly organizationService: OrganizationService) {
    super(organizationService);
  }

  getActiveOrganizations = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const organizations = await this.organizationService.findActive();
      return { data: organizations };
    });
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const organizationId = req.params.id;
      const { status } = req.body;
      const organization = await this.organizationService.updateStatus(organizationId, { status });
      return { data: organization };
    });
  };

  getMembers = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const organizationId = req.params.id;
      const members = await this.organizationService.getMembers(organizationId);
      return { data: members };
    });
  };

  addMember = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const organizationId = req.params.id;
      const { userId } = req.body;
      const result = await this.organizationService.addMember(organizationId, userId);
      return { data: result };
    });
  };

  removeMember = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const organizationId = req.params.id;
      const userId = req.params.userId;
      await this.organizationService.removeMember(organizationId, userId);
      return { message: 'Member removed successfully' };
    });
  };
} 