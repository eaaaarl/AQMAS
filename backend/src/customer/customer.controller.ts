// customer.controller.ts
import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './core/service/customer.service';
import { CustomerType } from './customer.repository';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {
    // Bind the original method to maintain API compatibility
    this.getAllCustomerType = this.getAllCustomerType.bind(this);
  }

  // Keep the original method name and response format to maintain API compatibility
  async getAllCustomerType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { is_show } = req.query;
      const allCustomerTypes = await this.customerService.getAllCustomerType(
        is_show !== undefined ? Number(is_show) : undefined,
      );
      // Maintain the original response format: direct array response
      res.status(200).json(allCustomerTypes);
    } catch (error) {
      next(error);
    }
  }
}
