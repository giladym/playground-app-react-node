import { BaseEntity } from './entity.interface';
import { Types } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The comment ID
 *         featureId:
 *           type: string
 *           description: The ID of the feature this comment belongs to
 *         userId:
 *           type: string
 *           description: The ID of the user who created the comment
 *         parentCommentId:
 *           type: string
 *           description: The ID of the parent comment (for replies)
 *         content:
 *           type: string
 *           description: The content of the comment
 *         isApprovedSolution:
 *           type: boolean
 *           description: Whether this comment is marked as an approved solution
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked this comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the comment was last updated
 */
export interface Comment extends BaseEntity {
  featureId: Types.ObjectId;
  userId: Types.ObjectId;
  parentCommentId?: Types.ObjectId;
  content: string;
  isApprovedSolution: boolean;
  likes: Types.ObjectId[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCommentRequest:
 *       type: object
 *       required:
 *         - featureId
 *         - content
 *       properties:
 *         featureId:
 *           type: string
 *           description: The ID of the feature this comment belongs to
 *         content:
 *           type: string
 *           description: The content of the comment
 *         parentCommentId:
 *           type: string
 *           description: The ID of the parent comment (for replies)
 */
export interface CreateCommentRequest {
  featureId: string;
  userId: string;
  parentCommentId?: string;
  content: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCommentRequest:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The updated content of the comment
 *         isApprovedSolution:
 *           type: boolean
 *           description: Whether this comment should be marked as an approved solution
 */
export interface UpdateCommentRequest {
  content?: string;
  isApprovedSolution?: boolean;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The comment ID
 *         content:
 *           type: string
 *           description: The content of the comment
 *         isApprovedSolution:
 *           type: boolean
 *           description: Whether this comment is marked as an approved solution
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the comment was last updated
 *         featureId:
 *           type: string
 *           description: The ID of the feature this comment belongs to
 *         userId:
 *           type: string
 *           description: The ID of the user who created the comment
 *         parentCommentId:
 *           type: string
 *           description: The ID of the parent comment (for replies)
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs who liked this comment
 *         likeCount:
 *           type: integer
 *           description: The total number of likes on this comment
 */
export interface CommentResponse extends Omit<Comment, 'featureId' | 'userId' | 'parentCommentId' | 'likes'> {
  featureId: string;
  userId: string;
  parentCommentId?: string;
  likes: string[];
  likeCount: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ToggleLikeResponse:
 *       type: object
 *       properties:
 *         liked:
 *           type: boolean
 *           description: Whether the user has liked the comment after the toggle
 *         likeCount:
 *           type: integer
 *           description: The updated total number of likes
 */
export interface ToggleLikeResponse {
  liked: boolean;
  likeCount: number;
} 