import { QueueService } from './core/service/queue.service';
import { QueueController } from './queue.controller';
import { QueueRepository } from './queue.repository';

const queueRepository = new QueueRepository();
const queueService = new QueueService(queueRepository);
export const queueController = new QueueController(queueService);
