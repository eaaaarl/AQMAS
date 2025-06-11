// customer.controller.ts
import { NextFunction, Request, Response } from 'express';
import { CustomerService } from './core/service/customer.service';
import { ValidationError } from '../libs/CustomErrors';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {
    this.getAllCustomerType = this.getAllCustomerType.bind(this);
  }

  async getAllCustomerType(req: Request, res: Response, next: NextFunction) {
    try {
      const { is_show } = req.query;
      const allCustomerTypes = await this.customerService.getAllCustomerType(
        is_show !== undefined ? Number(is_show) : undefined,
      );
      res.status(200).json(allCustomerTypes);
    } catch (error) {
      next(error);
    }
  }
}
