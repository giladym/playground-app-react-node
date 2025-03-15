/**
 * @swagger
 * components:
 *   schemas:
 *     BaseEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEntity<T extends BaseEntity> = Omit<T, keyof BaseEntity>;
export type UpdateEntity<T extends BaseEntity> = Partial<CreateEntity<T>>; 