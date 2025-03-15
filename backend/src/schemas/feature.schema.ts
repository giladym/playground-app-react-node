import { z } from 'zod';
import { FeatureStatus } from '../interfaces/feature.interface';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateFeatureRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: The name of the feature
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           description: Detailed description of the feature
 *         type:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: The type/category of the feature
 *         config:
 *           type: object
 *           description: Optional configuration object
 */
export const createFeatureSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(1000),
    type: z.string().min(2).max(50),
    config: z.record(z.any()).optional()
  })
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateFeatureRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: The name of the feature
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           description: Detailed description of the feature
 *         type:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: The type/category of the feature
 */
export const updateFeatureSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    type: z.string().min(2).max(50).optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update"
  })
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateFeatureStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           $ref: '#/components/schemas/FeatureStatus'
 */
export const updateFeatureStatusSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    status: z.enum([FeatureStatus.Active, FeatureStatus.Inactive])
  })
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateFeatureConfigRequest:
 *       type: object
 *       required:
 *         - config
 *       properties:
 *         config:
 *           type: object
 *           description: New configuration object
 */
export const updateFeatureConfigSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    config: z.record(z.any())
  })
}); 