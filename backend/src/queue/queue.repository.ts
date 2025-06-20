import { Knex } from 'knex';
import { db } from '../infrastructure/database/database';
import { DatabaseErrors } from '../libs/CustomErrors';
import {
  queueByServiceCountDTO,
  queueCountQueryDTO,
  queueDetailsDTO,
  queueDTO,
} from './core/schema/queu.schema';
import { getTransDate } from '../libs/DateMoment';

export class QueueRepository {
  constructor(private database = db) {}

  async beginTransaction() {
    return this.database.transaction();
  }

  async createQueue(payload: queueDTO, trx?: Knex.Transaction) {
    const db = trx || this.database;
    try {
      const newQueue = await db('queue').insert({
        trans_id: payload.transId,
        type_id: payload.typeId,
        trans_status: payload.transStatus,
        single_trans_only: payload.singleTransOnly,
        customer_name: payload.customerName,
        trans_date: getTransDate()
      });
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
        service_id: p.service_id,
        trans_date: getTransDate()
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
      const result = await this.database('queue_detail as qd')
        .join('ent_service as es', 'qd.service_id', 'es.service_id')
        .whereRaw('DATE(qd.trans_date) = CURDATE()')
        .count('* as count')
        .first();

      return Number(result?.count) || 0;
    } catch (error) {
      console.error('Database error in countQueueAllService:', error);
      throw new DatabaseErrors('Failed to countQueueAllService method at Repository Layer');
    }
  }

 async countByServiceCount({ service_id }: queueByServiceCountDTO) {
  try {
    const result = await this.database('queue_detail as qd')
      .count('* as count')
      .where('qd.service_id', service_id)
      .andWhereRaw('DATE(qd.trans_date) = CURDATE()') // ← Critical fix here
      .first();
    return Number(result?.count) || 0;
  } catch (error) {
    console.error('Database error in countByServiceCount:', error);
    throw new DatabaseErrors('Failed to countQueueAllService method at Repository Layer');
  }
}
}
