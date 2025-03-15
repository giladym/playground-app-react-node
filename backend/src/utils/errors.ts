export class AppError extends Error {
  constructor(
    public statusCode: number,
    public status: string,
    message: string,
    public isOperational = true,
    public errors?: any[]
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, errors?: any[]) {
    super(400, 'Bad Request', message, true, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'Unauthorized', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, 'Forbidden', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, 'Not Found', message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'Conflict', message);
  }
}

export class ValidationError extends AppError {
  constructor(errors: any[]) {
    super(422, 'Validation Error', 'Invalid input data', true, errors);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(500, 'Database Error', message, true);
  }
} 