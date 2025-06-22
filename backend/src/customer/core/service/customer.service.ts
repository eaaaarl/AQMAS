import { CustomerRepository, CustomerType } from '../../customer.repository';

export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  // Keep the original method name to maintain API compatibility
  async getAllCustomerType(is_show?: number): Promise<CustomerType[]> {
    if (is_show !== undefined) {
      return await this.customerRepository.getAllCustomerType(is_show);
    }
    return await this.customerRepository.getAllCustomerTypes();
  }
}
