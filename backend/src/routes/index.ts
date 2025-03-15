import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import organizationRoutes from './organization.routes';
import featureRoutes from './feature.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/organizations', organizationRoutes);
router.use('/features', featureRoutes);

export default router; 