import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { CommentService } from '../services/comment.service';
import { Comment } from '../interfaces/comment.interface';
import { NotFoundError } from '../utils/errors';
import { CommentDocument } from '../models/comment.model';

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management endpoints
 */
export class CommentController extends BaseController<Comment, CommentDocument> {
  constructor(private readonly commentService: CommentService) {
    super(commentService);
  }

  /**
   * @swagger
   * /api/comments/feature/{featureId}:
   *   get:
   *     summary: Get all comments for a feature
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: featureId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the feature
   *     responses:
   *       200:
   *         description: List of comments
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/CommentResponse'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  getFeatureComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { featureId } = req.params;
      const comments = await this.commentService.findByFeature(featureId);
      return { data: comments };
    });
  };

  /**
   * @swagger
   * /api/comments/user/{userId}:
   *   get:
   *     summary: Get all comments by a user
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user
   *     responses:
   *       200:
   *         description: List of comments
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/CommentResponse'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  getUserComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { userId } = req.params;
      const comments = await this.commentService.findByUser(userId);
      return { data: comments };
    });
  };

  /**
   * @swagger
   * /api/comments/{id}/solution:
   *   patch:
   *     summary: Toggle solution status of a comment
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Comment ID
   *     responses:
   *       200:
   *         description: Updated comment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/CommentResponse'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  toggleSolution = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { id } = req.params;
      const comment = await this.commentService.toggleSolution(id);
      return { data: comment };
    });
  };

  /**
   * @swagger
   * /api/comments/{id}/like:
   *   patch:
   *     summary: Toggle like status on a comment
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Comment ID
   *     responses:
   *       200:
   *         description: Updated comment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/CommentResponse'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  toggleLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        throw new NotFoundError('User not found');
      }

      const comment = await this.commentService.toggleLike(id, userId);
      return { data: comment };
    });
  };

  /**
   * @swagger
   * /api/comments:
   *   post:
   *     summary: Create a new comment
   *     tags: [Comments]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCommentRequest'
   *     responses:
   *       201:
   *         description: Created comment
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/CommentResponse'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.user?.id;
      if (!userId) {
        throw new NotFoundError('User not found');
      }

      const comment = await this.commentService.createComment({
        ...req.body,
        userId
      });
      return { data: comment };
    });
  };
} 