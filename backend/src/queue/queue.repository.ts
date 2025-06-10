import { db } from '../infrastructure/database/database';
import { DatabaseErrors } from '../libs/CustomErrors';
import { queueDTO } from './core/schema/queu.schema';

export class QueueRepository {
  private database = db;

  async createQueue(payload: queueDTO) {
    try {
      const newQueue = await this.database('queue').insert({
        ...payload,
        trans_date: new Date(payload.trans_date),
      });

      return newQueue;
    } catch (error) {
      console.error('Database error in createQueue:', error);
      throw new DatabaseErrors('Failed to create queue at createQueue method');
    }
  }
}
