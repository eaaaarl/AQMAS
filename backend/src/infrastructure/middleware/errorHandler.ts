import { NextFunction, Request, Response } from 'express';
import { CustomErrors, ValidationError } from '../../libs/CustomErrors';
import { ZodError } from 'zod';

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

  if (err instanceof ZodError) {
    console.log('Validation errors raw:', err.errors);
    const formattedErrors = err.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message,
    }));

    res.status(400).json({
      message: 'Validation Error',
      errors: formattedErrors,
    });
    return;
  }

  res.status(500).json({
    message: 'Internal Server Error',
  });
};
