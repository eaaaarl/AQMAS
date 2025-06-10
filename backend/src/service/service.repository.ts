import { db } from '../infrastructure/database/database';

export class ServiceRepository {
  private database = db;

  async getService() {
    try {
      const service = await this.database('ent_service').select('*');
      return service;
    } catch (error) {
      console.error('Error fetching service service:', error);
      throw error;
    }
  }
}
