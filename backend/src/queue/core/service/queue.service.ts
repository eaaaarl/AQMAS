import { QueueRepository } from '../../queue.repository';
import {
  queueByServiceCountDTO,
  queueByServiceCountSchema,
  queueCountQueryDTO,
  queueCountQuerySchema,
  queueDetailsDTO,
  queueDetailsSchema,
  queueDTO,
  queueSchema,
} from '../schema/queu.schema';

export class QueueService {
  constructor(private readonly queueRepository: QueueRepository) {}

  async createQueue(data: queueDTO) {
    const queuePayload = queueSchema.parse(data);
    const newQueue = await this.queueRepository.createQueue(queuePayload);
    return newQueue;
  }

  async createQueueDetail(data: queueDetailsDTO[]) {
    const validatedPayload = data.map(item => queueDetailsSchema.parse(item));
    return await this.queueRepository.createQueueDetails(validatedPayload);
  }

  async createQueueWithDetail(queueData: queueDTO, queueDetailsData: queueDetailsDTO[]) {
    const trx = await this.queueRepository.beginTransaction();
    try {
      const queuePayload = queueSchema.parse(queueData);
      const detailsPayload = queueDetailsData.map(item => queueDetailsSchema.parse(item));

      const queue = await this.queueRepository.createQueue(queuePayload, trx);
      const details = await this.queueRepository.createQueueDetails(detailsPayload, trx);

      await trx.commit();
      return { queue, details };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async countQueue(data: queueCountQueryDTO) {
    const queueCountQueryPayload = queueCountQuerySchema.parse(data);
    const getQueueForToday = await this.queueRepository.countQueue(queueCountQueryPayload);
    return getQueueForToday;
  }

  async countQueueAllService() {
    return await this.queueRepository.countQueueAllService();
  }

  async countByServiceCount(data: queueByServiceCountDTO) {
    const queueByServiceCountPayload = queueByServiceCountSchema.parse(data);
    return await this.queueRepository.countByServiceCount(queueByServiceCountPayload);
  }
}
