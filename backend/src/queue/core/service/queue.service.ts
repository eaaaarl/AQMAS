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
import { QueueError, ValidationError } from '../../../libs/CustomErrors';
import { ZodError } from 'zod';

export class QueueService {
  private readonly CACHE_TTL = 60 * 1000; // 1 minute
  private countCache: Map<string, { value: number; timestamp: number }> = new Map();

  constructor(private readonly queueRepository: QueueRepository) {}

  private validateInput<T>(data: T, schema: any): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError('Invalid input data', error.errors);
      }
      throw error;
    }
  }

  private getCachedValue(key: string): number | null {
    const cached = this.countCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.value;
    }
    return null;
  }

  private setCachedValue(key: string, value: number): void {
    this.countCache.set(key, { value, timestamp: Date.now() });
  }

  async createQueue(data: queueDTO) {
    const queuePayload = this.validateInput(data, queueSchema);
    const newQueue = await this.queueRepository.createQueue(queuePayload);

    // Invalidate relevant caches
    this.countCache.clear();

    return newQueue;
  }

  async createQueueDetail(data: queueDetailsDTO[]) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new QueueError('Queue details array cannot be empty');
    }

    const validatedPayload = data.map(item => this.validateInput(item, queueDetailsSchema));
    const newQueueDetail = await this.queueRepository.createQueueDetails(validatedPayload);

    // Invalidate relevant caches
    this.countCache.clear();

    return newQueueDetail;
  }

  async createQueueWithDetail(queueData: queueDTO, queueDetailsData: queueDetailsDTO[]) {
    if (!Array.isArray(queueDetailsData) || queueDetailsData.length === 0) {
      throw new QueueError('Queue details array cannot be empty');
    }

    const queuePayload = this.validateInput(queueData, queueSchema);
    const detailsPayload = queueDetailsData.map(item =>
      this.validateInput(item, queueDetailsSchema),
    );

    const trx = await this.queueRepository.beginTransaction();
    try {
      const queue = await this.queueRepository.createQueue(queuePayload, trx);
      const details = await this.queueRepository.createQueueDetails(detailsPayload, trx);

      await trx.commit();

      // Invalidate relevant caches
      this.countCache.clear();

      return { queue, details };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async countQueue(data: queueCountQueryDTO) {
    const queueCountQueryPayload = this.validateInput(data, queueCountQuerySchema);
    const cacheKey = `count:${queueCountQueryPayload.Date}:${queueCountQueryPayload.type_id}`;

    const cachedValue = this.getCachedValue(cacheKey);
    if (cachedValue !== null) {
      return cachedValue;
    }

    const count = await this.queueRepository.countQueue(queueCountQueryPayload);
    this.setCachedValue(cacheKey, count);
    return count;
  }

  async countQueueAllService() {
    const cacheKey = 'count:all-services';

    const cachedValue = this.getCachedValue(cacheKey);
    if (cachedValue !== null) {
      return cachedValue;
    }

    const count = await this.queueRepository.countQueueAllService();
    this.setCachedValue(cacheKey, count);
    return count;
  }

  async countByServiceCount(data: queueByServiceCountDTO) {
    const payload = this.validateInput(data, queueByServiceCountSchema);
    const cacheKey = `count:service:${payload.service_id}`;

    const cachedValue = this.getCachedValue(cacheKey);
    if (cachedValue !== null) {
      return { count: cachedValue, service_name: 'Unknown Service' };
    }

    const result = await this.queueRepository.countByServiceCount(payload);
    this.setCachedValue(cacheKey, result);
    return result;
  }
}
