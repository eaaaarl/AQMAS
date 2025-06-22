import { NextFunction, Request, Response } from 'express';
import { 
  CustomErrors, 
  ValidationError, 
  NotFoundError, 
  ConflictError, 
  QueueError,
  UnauthorizedError,
  DatabaseErrors 
} from '../../libs/CustomErrors';
import { ResponseUtils } from '../../libs/ResponseUtils';
import { z, ZodError } from 'zod';

export const errorHandler = (
  err: Error | CustomErrors,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('Error Handler:', {
    error: err.message,
    stack: err.stack,
    constructor: err.constructor.name,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle custom application errors
  if (err instanceof CustomErrors) {
    const errorResponse = {
      code: err.code || 'CUSTOM_ERROR',
      details: err.details || null,
    };

    ResponseUtils.error(
      res,
      err.message,
      err.statusCode,
      undefined,
      { path: req.path }
    );
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const validationErrors = err.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message,
      code: error.code,
    }));

    ResponseUtils.validationError(
      res,
      'Validation failed',
      validationErrors
    );
    return;
  }

  // Handle specific error types with appropriate status codes
  if (err instanceof ValidationError) {
    ResponseUtils.validationError(res, err.message);
    return;
  }

  if (err instanceof NotFoundError) {
    ResponseUtils.notFound(res, err.message);
    return;
  }

  if (err instanceof ConflictError) {
    ResponseUtils.conflict(res, err.message);
    return;
  }

  if (err instanceof UnauthorizedError) {
    ResponseUtils.unauthorized(res, err.message);
    return;
  }

  if (err instanceof QueueError) {
    ResponseUtils.error(res, err.message, 400);
    return;
  }

  if (err instanceof DatabaseErrors) {
    ResponseUtils.error(res, 'Database operation failed', 500);
    return;
  }

  // Handle unknown errors
  ResponseUtils.internalServerError(res, 'An unexpected error occurred');
};
