import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validate-request';
import { createCommentSchema, updateCommentSchema } from '../schemas/comment.schema';
import { UserRole } from '../interfaces/user.interface';

const router = Router();
const controller = new CommentController();

// Get comments for a feature
router.get('/feature/:featureId', authenticate, controller.getFeatureComments);

// Get comments by user
router.get('/user/:userId', authenticate, controller.getUserComments);

// Create a new comment
router.post(
  '/',
  authenticate,
  validateRequest(createCommentSchema),
  controller.create
);

// Update a comment
router.put(
  '/:id',
  authenticate,
  validateRequest(updateCommentSchema),
  controller.update
);

// Delete a comment
router.delete('/:id', authenticate, controller.delete);

// Toggle solution status (admin only)
router.patch(
  '/:id/solution',
  authenticate,
  authorize([UserRole.ADMIN]),
  controller.toggleSolution
);

// Toggle like on a comment
router.patch('/:id/like', authenticate, controller.toggleLike);

export default router; 