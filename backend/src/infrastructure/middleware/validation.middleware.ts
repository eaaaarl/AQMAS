import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../../libs/CustomErrors';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body, query, and params
      const dataToValidate = {
        body: req.body,
        query: req.query,
        params: req.params,
      };

      schema.parse(dataToValidate);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        next(new ValidationError('Validation failed', validationErrors));
      } else {
        next(error);
      }
    }
  };
};

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        next(new ValidationError('Request body validation failed', validationErrors));
      } else {
        next(error);
      }
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        next(new ValidationError('Query parameters validation failed', validationErrors));
      } else {
        next(error);
      }
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        next(new ValidationError('URL parameters validation failed', validationErrors));
      } else {
        next(error);
      }
    }
  };
}; 