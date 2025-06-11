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

  async countQueueForTodayAlt(): Promise<number> {
    try {
      const result = await this.database('queue')
        .count('* as count')
        .whereRaw('DATE(trans_date) = CURDATE()') // For MySQL
        // .whereRaw('DATE(trans_date) = DATE(\'now\')') // For SQLite
        // .whereRaw('trans_date::date = CURRENT_DATE') // For PostgreSQL
        .first();

      return parseInt(result?.count as string) || 0;
    } catch (error) {
      console.error('Database error in countQueueForTodayAlt:', error);
      throw new DatabaseErrors('Failed to count queue for today at countQueueForTodayAlt method');
    }
  }
}
