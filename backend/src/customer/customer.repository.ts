// customer.repository.ts
import { db } from '../infrastructure/database/database';
import { DatabaseErrors } from '../libs/CustomErrors';

export class CustomerRepository {
  private database = db;

  async getAllCustomerType(is_show: number) {
    try {
      const customer = await this.database('customer_type').select('*').where('is_show', is_show);
      return customer;
    } catch (error) {
      console.error('Error at getAllCustomerType', error);
      throw new DatabaseErrors('Failed to fetch customer at getAllCustomerType method');
    }
  }

  async getAllCustomerTypes() {
    try {
      const customer = await this.database('customer_type').select('*');
      return customer;
    } catch (error) {
      console.error('Error at getAllCustomerTypes', error);
      throw new DatabaseErrors('Failed to fetch customer at getAllCustomerTypes method');
    }
  }
}
