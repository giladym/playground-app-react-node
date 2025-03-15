import { Router } from 'express';
import authRoutes from './auth.routes';
import featureRoutes from './feature.routes';
import organizationRoutes from './organization.routes';
import profileRoutes from './profile.routes';
import commentRoutes from './comment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/features', featureRoutes);
router.use('/organizations', organizationRoutes);
router.use('/profiles', profileRoutes);
router.use('/comments', commentRoutes);

export default router; 