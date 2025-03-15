import { Router } from 'express';
import { FeatureController } from '../controllers/feature.controller';
import { FeatureService } from '../services/feature.service';
import { FeatureRepository } from '../repositories/feature.repository';
import { validate } from '../middleware/validate.middleware';
import { 
  createFeatureSchema,
  updateFeatureSchema,
  updateFeatureStatusSchema,
  updateFeatureConfigSchema
} from '../schemas/feature.schema';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../interfaces/user.interface';

/**
 * @swagger
 * tags:
 *   name: Features
 *   description: Feature management endpoints
 */

const router = Router();

// Initialize dependencies
const featureRepository = new FeatureRepository();
const featureService = new FeatureService(featureRepository);
const featureController = new FeatureController(featureService);

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/features:
 *   get:
 *     summary: Get all features
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of features retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feature'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', featureController.getAll);

/**
 * @swagger
 * /api/features/{id}:
 *   get:
 *     summary: Get a specific feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Feature retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feature'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', featureController.getById);

/**
 * @swagger
 * /api/features/active:
 *   get:
 *     summary: Get active features
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active features retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feature'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/active', featureController.getActiveFeatures);

/**
 * @swagger
 * /api/features/type/{type}:
 *   get:
 *     summary: Get features by type
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Feature type
 *     responses:
 *       200:
 *         description: List of features retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feature'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/type/:type', featureController.getFeaturesByType);

/**
 * @swagger
 * /api/features:
 *   post:
 *     summary: Create a new feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeatureRequest'
 *     responses:
 *       201:
 *         description: Feature created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feature'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/',
  authorize([UserRole.ADMIN]),
  validate(createFeatureSchema),
  featureController.createFeature
);

/**
 * @swagger
 * /api/features/{id}:
 *   put:
 *     summary: Update a feature
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFeatureRequest'
 *     responses:
 *       200:
 *         description: Feature updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feature'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id',
  authorize([UserRole.ADMIN]),
  validate(updateFeatureSchema),
  featureController.updateFeature
);

/**
 * @swagger
 * /api/features/{id}/status:
 *   patch:
 *     summary: Update feature status
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFeatureStatusRequest'
 *     responses:
 *       200:
 *         description: Feature status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feature'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/status',
  authorize([UserRole.ADMIN]),
  validate(updateFeatureStatusSchema),
  featureController.updateStatus
);

/**
 * @swagger
 * /api/features/{id}/config:
 *   patch:
 *     summary: Update feature config
 *     tags: [Features]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFeatureConfigRequest'
 *     responses:
 *       200:
 *         description: Feature config updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feature'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/config',
  authorize([UserRole.ADMIN]),
  validate(updateFeatureConfigSchema),
  featureController.updateConfig
);

export default router; 