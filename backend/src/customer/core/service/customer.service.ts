import { CustomerRepository } from '../../customer.repository';

export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async getAllCustomerType(is_show?: number) {
    if (is_show !== undefined) {
      return await this.customerRepository.getAllCustomerType(is_show);
    }
    return await this.customerRepository.getAllCustomerTypes();
  }
}
