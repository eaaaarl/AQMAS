import { NextFunction, Request, Response } from 'express';
import { QueueService } from './core/service/queue.service';

export class QueueController {
  constructor(private readonly queueService: QueueService) {
    this.createQueue = this.createQueue.bind(this);
    this.countQueue = this.countQueue.bind(this);
  }

  async createQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      console.log(payload);
      const newQueue = await this.queueService.createQueue(payload);

      res.status(200).json(newQueue);
    } catch (error) {
      next(error);
    }
  }

  async countQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const countQueue = await this.queueService.countQueue();
      res.status(200).json({ count: countQueue });
    } catch (error) {
      next(error);
    }
  }
}
