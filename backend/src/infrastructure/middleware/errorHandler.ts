import { NextFunction, Request, Response } from 'express';
import { CustomErrors } from '../../libs/CustomErrors';
import { ResponseUtils } from '../../libs/ResponseUtils';
import { ZodError } from 'zod';
import { logger } from '../logger/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error(err.message, {
    stack: err.stack,
    name: err.constructor.name,
    path: req.path,
    method: req.method,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const validationErrors = err.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message,
      code: error.code,
    }));

    ResponseUtils.validationError(res, 'Validation failed', validationErrors);
    return;
  }

  // Handle custom application errors
  if (err instanceof CustomErrors) {
    ResponseUtils.error(
      res,
      err.message,
      err.statusCode,
      err.details ? (Array.isArray(err.details) ? err.details : [err.details]) : undefined,
      { path: req.path },
    );
    return;
  }

  // Handle unknown errors
  ResponseUtils.internalServerError(res, 'An unexpected error occurred');
};
