/**
 * @swagger
 * components:
 *   responses:
 *     BadRequest:
 *       description: Invalid input data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                     message:
 *                       type: string
 * 
 *     Unauthorized:
 *       description: Authentication is required
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Unauthorized
 * 
 *     Forbidden:
 *       description: Not enough permissions
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Forbidden
 * 
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Not Found
 * 
 *     InternalError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Internal Server Error
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token for authentication
 * 
 *   parameters:
 *     idParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Resource identifier
 * 
 *     userIdParam:
 *       in: path
 *       name: userId
 *       required: true
 *       schema:
 *         type: string
 *       description: User identifier
 * 
 *     organizationIdParam:
 *       in: path
 *       name: organizationId
 *       required: true
 *       schema:
 *         type: string
 *       description: Organization identifier
 */

// This file only contains Swagger documentation
export {}; 