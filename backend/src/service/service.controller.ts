import { NextFunction, Request, Response } from 'express';
import { ServiceService } from './core/service/service.service';
import { ResponseUtils } from '../libs/ResponseUtils';
import { CustomErrors } from '../libs/CustomErrors';

export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {
    this.getService = this.getService.bind(this);
  }

  async getService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await this.serviceService.getService();
      //ResponseUtils.success(res, services, 'Services retrieved successfully');
      res.status(200).json({results: services});
    } catch (error) {
      if (error instanceof CustomErrors) {
        ResponseUtils.error(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }
}
