export class CustomErrors extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string,
    public details?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseErrors extends CustomErrors {
  constructor(message: string, details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class ValidationError extends CustomErrors {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends CustomErrors {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class UnauthorizedError extends CustomErrors {
  constructor(message: string = 'Unauthorized access', details?: any) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

export class ConflictError extends CustomErrors {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class QueueError extends CustomErrors {
  constructor(message: string, details?: any) {
    super(message, 400, 'QUEUE_ERROR', details);
  }
}

export class ServiceUnavailableError extends CustomErrors {
  constructor(message: string = 'Service temporarily unavailable', details?: any) {
    super(message, 503, 'SERVICE_UNAVAILABLE', details);
  }
}
