import { db } from '../infrastructure/database/database';
import { DatabaseErrors } from '../libs/CustomErrors';

export class ConfigRepository {
  private database = db;

  async getAllConfig() {
    try {
      const configs = await this.database('config').select('*');
      return configs;
    } catch (error) {
      throw new DatabaseErrors('Failed to get all configs at getAllConfig method');
    }
  }
}
