import { NextFunction, Request, Response } from 'express';
import { CustomErrors, ValidationError } from '../../libs/CustomErrors';
import { z, ZodError } from 'zod';

export const errorHandler = (
  err: Error | CustomErrors,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('ERROR HANDLER', err);
  console.error('ERROR HANDLER CONSTRUCTOR NAME', err.constructor.name);

  if (err instanceof CustomErrors) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  if (err instanceof z.ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      })),
    });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: err,
    });
    return;
  }

  res.status(500).json({
    message: 'Internal Server Error',
  });
};
