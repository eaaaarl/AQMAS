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
  private readonly TABLE_NAME = 'queue';
  private readonly DETAIL_TABLE_NAME = 'queue_detail';

  constructor(private readonly database = db) {}

  async beginTransaction(): Promise<Knex.Transaction> {
    return this.database.transaction();
  }

  private handleDatabaseError(error: any, methodName: string): never {
    console.error(`Database error in ${methodName}:`, error);
    throw new DatabaseErrors(
      `Failed to execute operation in ${methodName} at Repository Layer`,
      error,
    );
  }

  async createQueue(payload: queueDTO, trx?: Knex.Transaction) {
    const db = trx || this.database;
    try {
      const [newQueue] = await db(this.TABLE_NAME)
        .insert({
          trans_id: payload.transId,
          type_id: payload.typeId,
          trans_status: payload.transStatus,
          single_trans_only: payload.singleTransOnly,
          customer_name: payload.customerName,
          trans_date: getTransDate(),
        })
        .returning('*');

      return newQueue;
    } catch (error) {
      this.handleDatabaseError(error, 'createQueue');
    }
  }

  async createQueueDetails(payload: queueDetailsDTO[], trx?: Knex.Transaction) {
    const db = trx || this.database;
    try {
      const dataToInsert = payload.map(p => ({
        trans_id: p.trans_id,
        service_id: p.service_id,
        trans_date: getTransDate(),
      }));

      const newQueueDetails = await db(this.DETAIL_TABLE_NAME).insert(dataToInsert).returning('*');

      return newQueueDetails;
    } catch (error) {
      this.handleDatabaseError(error, 'createQueueDetails');
    }
  }

  async countQueue({ Date, type_id }: queueCountQueryDTO): Promise<number> {
    try {
      const result = await this.database(this.TABLE_NAME)
        .count('* as count')
        .whereRaw(`${Date}`)
        .andWhere('type_id', type_id)
        .first();

      return parseInt(result?.count as string) || 1;
    } catch (error) {
      this.handleDatabaseError(error, 'countQueue');
    }
  }

  async countQueueAllService(): Promise<number> {
    try {
      const result = await this.database(this.DETAIL_TABLE_NAME)
        .select(this.database.raw('COUNT(DISTINCT qd.trans_id) as count'))
        .from(`${this.DETAIL_TABLE_NAME} as qd`)
        .join('ent_service as es', 'qd.service_id', 'es.service_id')
        .whereRaw('DATE(qd.trans_date) = CURDATE()')
        .first();

      return Number(result?.count) || 1;
    } catch (error) {
      this.handleDatabaseError(error, 'countQueueAllService');
    }
  }

  async countByServiceCount({ service_id }: queueByServiceCountDTO): Promise<number> {
    try {
      const result = await this.database(this.DETAIL_TABLE_NAME)
        .count('* as count')
        .where('service_id', service_id)
        .whereRaw('DATE(trans_date) = CURDATE()')
        .first();

      return Number(result?.count) || 1;
    } catch (error) {
      this.handleDatabaseError(error, 'countByServiceCount');
    }
  }
}
