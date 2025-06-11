import { CustomerService } from './core/service/customer.service';
import { CustomerController } from './customer.controller';
import { CustomerRepository } from './customer.repository';

const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);
export const customerController = new CustomerController(customerService);
