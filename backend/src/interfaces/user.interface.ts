import { BaseEntity } from './entity.interface';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [user, admin]
 *       description: The role of a user in the system
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *         - type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: User's email address
 *             password:
 *               type: string
 *               format: password
 *               description: User's hashed password
 *             firstName:
 *               type: string
 *               description: User's first name
 *             lastName:
 *               type: string
 *               description: User's last name
 *             role:
 *               $ref: '#/components/schemas/UserRole'
 *             isEmailVerified:
 *               type: boolean
 *               description: Whether the user's email is verified
 *             lastLogin:
 *               type: string
 *               format: date-time
 *               description: Last login timestamp
 *           required:
 *             - email
 *             - password
 *             - firstName
 *             - lastName
 *             - role
 *             - isEmailVerified
 */
export interface User extends BaseEntity {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  lastLogin?: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseEntity'
 *         - type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             role:
 *               $ref: '#/components/schemas/UserRole'
 *             isEmailVerified:
 *               type: boolean
 *             lastLogin:
 *               type: string
 *               format: date-time
 */
export interface UserResponse extends Omit<User, 'password'> {}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         firstName:
 *           type: string
 *           description: User's first name
 *         lastName:
 *           type: string
 *           description: User's last name
 */
export interface RegisterRequest extends Omit<User, keyof BaseEntity | 'role' | 'isEmailVerified' | 'lastLogin'> {} 