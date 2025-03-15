import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { CommentDocument } from '../models/comment.model';
import { CommentService } from '../services/comment.service';

export class CommentController extends BaseController<CommentDocument> {
  constructor(private readonly commentService: CommentService) {
    super(commentService);
  }

  getFeatureComments = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const featureId = req.params.featureId;
      const comments = await this.commentService.findByFeature(featureId);
      return { data: comments };
    });
  };

  getUserComments = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.params.userId;
      const comments = await this.commentService.findByUser(userId);
      return { data: comments };
    });
  };

  toggleSolution = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const commentId = req.params.id;
      const comment = await this.commentService.toggleSolution(commentId);
      return { data: comment };
    });
  };

  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    await this.handleRequest(req, res, next, async () => {
      const commentId = req.params.id;
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const comment = await this.commentService.toggleLike(commentId, userId);
      return { data: comment };
    });
  };
} 