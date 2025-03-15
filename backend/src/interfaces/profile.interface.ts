import { BaseEntity } from './entity.interface';
import { Types } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *         - type: object
 *           properties:
 *             userId:
 *               type: string
 *               description: Associated user ID
 *             name:
 *               type: string
 *               description: Profile display name
 *             age:
 *               type: integer
 *               minimum: 0
 *               maximum: 150
 *               description: User's age
 *             phone:
 *               type: string
 *               pattern: ^\+?[1-9]\d{1,14}$
 *               description: Phone number in E.164 format
 *             imageUrl:
 *               type: string
 *               format: uri
 *               description: URL to profile image
 *             organizationId:
 *               type: string
 *               description: Associated organization ID
 *           required:
 *             - userId
 *             - name
 */
export interface Profile extends BaseEntity {
  userId: Types.ObjectId;
  name: string;
  age?: number;
  phone?: string;
  imageUrl?: string;
  organizationId?: Types.ObjectId;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProfileRequest:
 *       type: object
 *       required:
 *         - userId
 *         - name
 *       properties:
 *         userId:
 *           type: string
 *           description: Associated user ID
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Profile display name
 *         age:
 *           type: integer
 *           minimum: 0
 *           maximum: 150
 *           description: User's age
 *         phone:
 *           type: string
 *           pattern: ^\+?[1-9]\d{1,14}$
 *           description: Phone number in E.164 format
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to profile image
 *         organizationId:
 *           type: string
 *           description: Associated organization ID
 */
export interface CreateProfileRequest {
  userId: string;
  name: string;
  age?: number;
  phone?: string;
  imageUrl?: string;
  organizationId?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Profile display name
 *         age:
 *           type: integer
 *           minimum: 0
 *           maximum: 150
 *           description: User's age
 *         phone:
 *           type: string
 *           pattern: ^\+?[1-9]\d{1,14}$
 *           description: Phone number in E.164 format
 */
export interface UpdateProfileRequest {
  name?: string;
  age?: number;
  phone?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileImageRequest:
 *       type: object
 *       required:
 *         - imageUrl
 *       properties:
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL to profile image
 */
export interface UpdateProfileImageRequest {
  imageUrl: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfilePhoneRequest:
 *       type: object
 *       required:
 *         - phone
 *       properties:
 *         phone:
 *           type: string
 *           pattern: ^\+?[1-9]\d{1,14}$
 *           description: Phone number in E.164 format
 */
export interface UpdateProfilePhoneRequest {
  phone: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileOrganizationRequest:
 *       type: object
 *       required:
 *         - organizationId
 *       properties:
 *         organizationId:
 *           type: string
 *           description: Associated organization ID
 */
export interface UpdateProfileOrganizationRequest {
  organizationId: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Profile'
 *         - type: object
 *           properties:
 *             organization:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 */
export interface ProfileResponse extends Omit<Profile, 'userId' | 'organizationId'> {
  userId: string;
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
  };
} 