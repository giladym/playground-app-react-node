import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import config from '../config/env.config';
import { ValidationError, NotFoundError, UnauthorizedError, ForbiddenError } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error with request context
  logger.error('Request error:', {
    error: {
      name: err.name,
      message: err.message,
      stack: config.isDevelopment ? err.stack : undefined,
    },
    request: {
      method: req.method,
      url: req.url,
      body: config.isDevelopment ? req.body : undefined,
      user: req.user ? { id: req.user.id } : undefined
    }
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
      ...(config.isDevelopment && { stack: err.stack }),
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Validation Error',
      errors: err.errors,
    });
  }

  // Handle Mongoose validation errors
  if (err instanceof MongooseError.ValidationError) {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(400).json({
      status: 'Bad Request',
      message: 'Validation Error',
      errors,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(409).json({
      status: 'Conflict',
      message: `${field} already exists`,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'Token expired',
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.message,
      errors: err.errors
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      message: err.message
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      message: err.message
    });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      message: err.message
    });
  }

  // Handle unknown errors
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    status: 'error',
    message: config.isProduction ? 'Internal Server Error' : err.message,
    ...(config.isDevelopment && { stack: err.stack }),
  });
}; 