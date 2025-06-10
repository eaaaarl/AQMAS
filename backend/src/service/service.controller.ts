import { NextFunction, Request, Response } from 'express';
import { ServiceService } from './core/service/service.service';

export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {
    this.getService = this.getService.bind(this);
  }

  async getService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await this.serviceService.getService();
      res.status(200).json(service);
    } catch (error) {
      console.error('Error in ServiceController GetService:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
