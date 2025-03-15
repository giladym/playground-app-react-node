import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../services/organization.service';
import { OrganizationRepository } from '../repositories/organization.repository';
import { validate } from '../middleware/validate.middleware';
import { 
  createOrganizationSchema,
  updateOrganizationSchema,
  updateOrganizationStatusSchema,
  addMemberSchema
} from '../schemas/organization.schema';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../interfaces/user.interface';

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: Organization management endpoints
 */

const router = Router();

// Initialize dependencies
const organizationRepository = new OrganizationRepository();
const organizationService = new OrganizationService(organizationRepository);
const organizationController = new OrganizationController(organizationService);

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Get all organizations
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrganizationResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', organizationController.getAll);

/**
 * @swagger
 * /api/organizations/{id}:
 *   get:
 *     summary: Get a specific organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Organization retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrganizationResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', organizationController.getById);

/**
 * @swagger
 * /api/organizations/active:
 *   get:
 *     summary: Get active organizations
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active organizations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrganizationResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/active', organizationController.getActiveOrganizations);

/**
 * @swagger
 * /api/organizations/{id}/members:
 *   get:
 *     summary: Get organization members
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Organization members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organization:
 *                   $ref: '#/components/schemas/OrganizationResponse'
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id/members', organizationController.getMembers);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrganizationRequest'
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrganizationResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/',
  authorize([UserRole.ADMIN]),
  validate(createOrganizationSchema),
  organizationController.create
);

/**
 * @swagger
 * /api/organizations/{id}:
 *   put:
 *     summary: Update an organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrganizationRequest'
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrganizationResponse'
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
  validate(updateOrganizationSchema),
  organizationController.update
);

/**
 * @swagger
 * /api/organizations/{id}/status:
 *   patch:
 *     summary: Update organization status
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrganizationStatusRequest'
 *     responses:
 *       200:
 *         description: Organization status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrganizationResponse'
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
  validate(updateOrganizationStatusSchema),
  organizationController.updateStatus
);

/**
 * @swagger
 * /api/organizations/{id}/members:
 *   post:
 *     summary: Add member to organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddMemberRequest'
 *     responses:
 *       200:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 profile:
 *                   $ref: '#/components/schemas/ProfileResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/:id/members',
  authorize([UserRole.ADMIN]),
  validate(addMemberSchema),
  organizationController.addMember
);

/**
 * @swagger
 * /api/organizations/{id}/members/{userId}:
 *   delete:
 *     summary: Remove member from organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *       - $ref: '#/components/parameters/userIdParam'
 *     responses:
 *       200:
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id/members/:userId',
  authorize([UserRole.ADMIN]),
  organizationController.removeMember
);

export default router; 