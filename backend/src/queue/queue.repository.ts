import { Knex } from 'knex';
import { db } from '../infrastructure/database/database';
import { DatabaseErrors } from '../libs/CustomErrors';
import { queueDetailsDTO, queueDTO } from './core/schema/queu.schema';

export class QueueRepository {
  constructor(private database = db) {}

  async beginTransaction() {
    return this.database.transaction();
  }

  async createQueue(payload: queueDTO, trx?: Knex.Transaction) {
    const db = trx || this.database;
    try {
      const [transId] = await db('queue').insert({
        ...payload,
        trans_date: new Date().toISOString(),
      });

      const newQueue = await db('queue').where('trans_id', transId).first();

      return newQueue;
    } catch (error) {
      console.error('Database error in createQueue:', error);
      throw new DatabaseErrors('Failed to create queue at createQueue method at Repository Layer');
    }
  }

  async createQueueDetails(payload: queueDetailsDTO[], trx?: Knex.Transaction) {
    const db = trx || this.database;
    try {
      const dataToInsert = payload.map(p => ({
        trans_id: p.trans_id,
        trans_date: new Date().toISOString(),
        service_id: p.service_id,
      }));

      const insertedIds = await db('queue_detail').insert(dataToInsert);

      const newQueueDetails = await db('queue_detail').whereIn('trans_id', insertedIds);
      return newQueueDetails;
    } catch (error) {
      console.error('Database error in createQueueDetails:', error);
      throw new DatabaseErrors(
        'Failed to create queue detail at createQueueDetails method at Repository Layer',
      );
    }
  }

  async countQueue(): Promise<number> {
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
      throw new DatabaseErrors('Failed to count queue countQueue method at Repository Layer');
    }
  }
}
