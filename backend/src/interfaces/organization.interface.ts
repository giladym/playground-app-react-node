import { BaseEntity } from './entity.interface';
import { ProfileResponse } from './profile.interface';

/**
 * @swagger
 * components:
 *   schemas:
 *     OrganizationStatus:
 *       type: string
 *       enum: [active, inactive]
 *       description: The status of an organization
 */
export enum OrganizationStatus {
  Active = 'active',
  Inactive = 'inactive'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *         - type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Organization name
 *             description:
 *               type: string
 *               description: Organization description
 *             imageUrl:
 *               type: string
 *               format: uri
 *               description: URL to organization's image
 *             status:
 *               $ref: '#/components/schemas/OrganizationStatus'
 *             memberIds:
 *               type: array
 *               items:
 *                 type: string
 *               description: List of member user IDs
 *           required:
 *             - name
 *             - description
 *             - status
 */
export interface Organization extends BaseEntity {
  name: string;
  description: string;
  imageUrl?: string;
  status: OrganizationStatus;
  memberIds: string[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOrganizationRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Organization name
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           description: Organization description
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to organization's image
 */
export interface CreateOrganizationRequest {
  name: string;
  description: string;
  imageUrl?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateOrganizationRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Organization name
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           description: Organization description
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to organization's image
 */
export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateOrganizationStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           $ref: '#/components/schemas/OrganizationStatus'
 */
export interface UpdateOrganizationStatusRequest {
  status: OrganizationStatus;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     AddMemberRequest:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user to add as a member
 */
export interface AddMemberRequest {
  userId: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     OrganizationResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Organization'
 *         - type: object
 *           properties:
 *             memberCount:
 *               type: integer
 *               description: Number of members in the organization
 */
export interface OrganizationResponse extends Organization {
  memberCount?: number;
}

export interface OrganizationMembersResponse {
  organization: OrganizationResponse;
  members: ProfileResponse[];
}

export interface AddMemberResponse {
  success: boolean;
  message: string;
  profile?: ProfileResponse;
} 