import { BaseEntity } from './entity.interface';

/**
 * @swagger
 * components:
 *   schemas:
 *     FeatureStatus:
 *       type: string
 *       enum: [active, inactive]
 *       description: The status of a feature
 */
export enum FeatureStatus {
  Active = 'active',
  Inactive = 'inactive'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Feature:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The feature's unique identifier
 *         name:
 *           type: string
 *           description: The name of the feature
 *         description:
 *           type: string
 *           description: Detailed description of the feature
 *         type:
 *           type: string
 *           description: The type/category of the feature
 *         status:
 *           $ref: '#/components/schemas/FeatureStatus'
 *         config:
 *           type: object
 *           description: Configuration object for the feature
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - description
 *         - type
 */
export interface Feature extends BaseEntity {
  name: string;
  description: string;
  type: string;
  status: FeatureStatus;
  config?: Record<string, any>;
}

export interface CreateFeatureRequest {
  name: string;
  description: string;
  type: string;
  config?: Record<string, any>;
}

export interface UpdateFeatureRequest {
  name?: string;
  description?: string;
  type?: string;
  config?: Record<string, any>;
}

export interface UpdateFeatureStatusRequest {
  status: FeatureStatus;
}

export interface UpdateFeatureConfigRequest {
  config: Record<string, any>;
}

export interface FeatureResponse extends Feature {
  commentCount?: number;
} 