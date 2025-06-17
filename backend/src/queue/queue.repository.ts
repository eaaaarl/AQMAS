import { Knex } from 'knex';
import { db } from '../infrastructure/database/database';
import { DatabaseErrors } from '../libs/CustomErrors';
import {
  queueByServiceCountDTO,
  queueCountQueryDTO,
  queueDetailsDTO,
  queueDTO,
} from './core/schema/queu.schema';

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

  async countQueue({ Date, type_id }: queueCountQueryDTO): Promise<number> {
    try {
      const result = await this.database('queue')
        .count('* as count')
        .whereRaw(`${Date}`)
        .andWhere('type_id', type_id)
        .first();

      return parseInt(result?.count as string) || 0;
    } catch (error) {
      console.error('Database error in countQueue:', error);
      throw new DatabaseErrors('Failed to count queue countQueue method at Repository Layer');
    }
  }

  async countQueueAllService(): Promise<number> {
    try {
      const result = await this.database('queue')
        .count('* as count')
        .where('trans_date', 'DATE(NOW())')
        .first();

      return Number(result?.count) || 0;
    } catch (error) {
      console.error('Database error in countQueueAllService:', error);
      throw new DatabaseErrors('Failed to countQueueAllService method at Repository Layer');
    }
  }

  async countByServiceCount({ service_id }: queueByServiceCountDTO) {
    try {
      const result = await this.database('queue')
        .count('* as count')
        .where('type_id', service_id)
        .andWhere('trans_date', 'DATE(NOW())')
        .first();
      return Number(result?.count) || 0;
    } catch (error) {
      console.error('Database error in countByServiceCount:', error);
      throw new DatabaseErrors('Failed to countQueueAllService method at Repository Layer');
    }
  }
}
