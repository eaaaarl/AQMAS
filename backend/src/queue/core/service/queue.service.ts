import { QueueRepository } from '../../queue.repository';
import { queueDetailsDTO, queueDetailsSchema, queueDTO, queueSchema } from '../schema/queu.schema';

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

  async countQueue() {
    const getQueueForToday = this.queueRepository.countQueue();
    return getQueueForToday;
  }
}
