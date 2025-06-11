import { NextFunction, Request, Response } from 'express';
import { QueueService } from './core/service/queue.service';

export class QueueController {
  constructor(private readonly queueService: QueueService) {
    this.createQueue = this.createQueue.bind(this);
  }

  async createQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const newQueue = await this.queueService.createQueue(payload);

      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }

  async countQueueForTodayAlt() {}
}
