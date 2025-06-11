import { QueueRepository } from '../../queue.repository';
import { queueDTO, queueSchema } from '../schema/queu.schema';

export class QueueService {
  constructor(private readonly queueRepository: QueueRepository) {}

  async createQueue(data: queueDTO) {
    const payload = queueSchema.parse(data);
    const newQueue = await this.queueRepository.createQueue(payload);
    return newQueue;
  }

  async countQueue() {
    const getQueueForToday = this.queueRepository.countQueue();
    return getQueueForToday;
  }
}
