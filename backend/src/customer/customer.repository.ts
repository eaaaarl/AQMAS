import { db } from '../infrastructure/database/database';
import { DatabaseErrors } from '../libs/CustomErrors';

export interface CustomerType {
  id?: number;
  name: string;
  description?: string;
  is_show: number;
  created_at?: Date;
  updated_at?: Date;
}

export class CustomerRepository {
  protected tableName = 'customer_type';
  private database = db;

  async getAllCustomerType(is_show: number): Promise<CustomerType[]> {
    try {
      return await this.database(this.tableName).select('*').where('is_show', is_show);
    } catch (error) {
      console.error('Error at getAllCustomerType', error);
      throw new DatabaseErrors('Failed to fetch customer at getAllCustomerType method');
    }
  }

  async getAllCustomerTypes(): Promise<CustomerType[]> {
    try {
      return await this.database(this.tableName).select('*');
    } catch (error) {
      console.error('Error at getAllCustomerTypes', error);
      throw new DatabaseErrors('Failed to fetch customer at getAllCustomerTypes method');
    }
  }
}
