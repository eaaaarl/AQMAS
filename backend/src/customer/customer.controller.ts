import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './core/service/customer.service';
import { ResponseUtils } from '../libs/ResponseUtils';
import { ValidationError } from '../libs/CustomErrors';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {
    this.getAllCustomerType = this.getAllCustomerType.bind(this);
  }

  async getAllCustomerType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { is_show } = req.query;

      if (is_show !== undefined && !['0', '1'].includes(is_show as string)) {
        throw new ValidationError('is_show parameter must be 0 or 1');
      }

      const allCustomerTypes = await this.customerService.getAllCustomerType(
        is_show !== undefined ? Number(is_show) : undefined,
      );

      ResponseUtils.success(res, allCustomerTypes, 'Customer types retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
