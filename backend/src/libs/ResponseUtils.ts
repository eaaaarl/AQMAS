import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    timestamp: string;
    path?: string;
    duration?: number;
  };
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}

export class ResponseUtils {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Operation completed successfully',
    statusCode: number = 200,
    meta?: Omit<ApiResponse['meta'], 'timestamp'>,
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully',
  ): Response {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: Array<{ field?: string; message: string; code?: string }>,
    meta?: Omit<ApiResponse['meta'], 'timestamp'>,
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };

    return res.status(statusCode).json(response);
  }

  static validationError(
    res: Response,
    message: string = 'Validation failed',
    errors: Array<{ field?: string; message: string; code?: string }> = [],
  ): Response {
    return this.error(res, message, 400, errors);
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  static conflict(res: Response, message: string = 'Resource conflict'): Response {
    return this.error(res, message, 409);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized access'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden access'): Response {
    return this.error(res, message, 403);
  }

  static internalServerError(res: Response, message: string = 'Internal server error'): Response {
    return this.error(res, message, 500);
  }
}
