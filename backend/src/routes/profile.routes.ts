import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileService } from '../services/profile.service';
import { ProfileRepository } from '../repositories/profile.repository';
import { validate } from '../middleware/validate.middleware';
import { 
  createProfileSchema,
  updateProfileSchema,
  updateProfileImageSchema,
  updateProfilePhoneSchema,
  updateProfileOrganizationSchema
} from '../schemas/profile.schema';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../interfaces/user.interface';

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Profile management endpoints
 */

const router = Router();

// Initialize dependencies
const profileRepository = new ProfileRepository();
const profileService = new ProfileService(profileRepository);
const profileController = new ProfileController(profileService);

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/profiles:
 *   get:
 *     summary: Get all profiles
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', profileController.getAll);

/**
 * @swagger
 * /api/profiles/{id}:
 *   get:
 *     summary: Get a specific profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', profileController.getById);

/**
 * @swagger
 * /api/profiles/user/{userId}:
 *   get:
 *     summary: Get profile by user ID
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/user/:userId', profileController.getByUserId);

/**
 * @swagger
 * /api/profiles/organization/{organizationId}:
 *   get:
 *     summary: Get profiles by organization
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/organizationIdParam'
 *     responses:
 *       200:
 *         description: List of profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/organization/:organizationId', profileController.getByOrganization);

/**
 * @swagger
 * /api/profiles:
 *   post:
 *     summary: Create a new profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProfileRequest'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/',
  validate(createProfileSchema),
  profileController.create
);

/**
 * @swagger
 * /api/profiles/{id}:
 *   put:
 *     summary: Update a profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
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
  validate(updateProfileSchema),
  profileController.update
);

/**
 * @swagger
 * /api/profiles/{id}/image:
 *   patch:
 *     summary: Update profile image
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileImageRequest'
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/image',
  authorize([UserRole.ADMIN]),
  validate(updateProfileImageSchema),
  profileController.updateImage
);

/**
 * @swagger
 * /api/profiles/{id}/phone:
 *   patch:
 *     summary: Update profile phone
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilePhoneRequest'
 *     responses:
 *       200:
 *         description: Profile phone updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/phone',
  authorize([UserRole.ADMIN]),
  validate(updateProfilePhoneSchema),
  profileController.updatePhone
);

/**
 * @swagger
 * /api/profiles/{id}/organization:
 *   patch:
 *     summary: Update profile organization
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileOrganizationRequest'
 *     responses:
 *       200:
 *         description: Profile organization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/organization',
  authorize([UserRole.ADMIN]),
  validate(updateProfileOrganizationSchema),
  profileController.updateOrganization
);

export default router; 