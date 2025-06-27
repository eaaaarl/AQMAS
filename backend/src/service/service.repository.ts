import { db } from '../infrastructure/database/database';
import { CustomErrors } from '../libs/CustomErrors';
import { logger } from '../infrastructure/logger/logger';

export class ServiceRepository {
  private database = db;
  private readonly tableName = 'ent_service';

  async getService() {
    try {
      const services = await this.database(this.tableName).select('*');
      return services;
    } catch (error) {
      logger.error('Database error in ServiceRepository.getService:', { error });
      throw new CustomErrors('Failed to fetch services', 500);
    }
  }
}
