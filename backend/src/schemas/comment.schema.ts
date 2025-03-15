import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCommentValidation:
 *       type: object
 *       required:
 *         - featureId
 *         - content
 *       properties:
 *         featureId:
 *           type: string
 *           minLength: 1
 *           description: The ID of the feature this comment belongs to
 *         content:
 *           type: string
 *           minLength: 1
 *           description: The content of the comment
 *         parentCommentId:
 *           type: string
 *           description: Optional ID of the parent comment for replies
 */
export const createCommentSchema = z.object({
  body: z.object({
    featureId: z.string().min(1, 'Feature ID is required'),
    content: z.string().min(1, 'Comment content is required'),
    parentCommentId: z.string().optional(),
  }),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCommentValidation:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           minLength: 1
 *           description: The updated content of the comment
 *         isApprovedSolution:
 *           type: boolean
 *           description: Whether this comment should be marked as an approved solution
 */
export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment content is required').optional(),
    isApprovedSolution: z.boolean().optional(),
  }),
}); 