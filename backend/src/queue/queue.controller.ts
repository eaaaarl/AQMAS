import { NextFunction, Request, Response } from 'express';
import { QueueService } from './core/service/queue.service';

export class QueueController {
  constructor(private readonly queueService: QueueService) {
    this.createQueue = this.createQueue.bind(this);
    this.createQueueDetail = this.createQueueDetail.bind(this);
    this.countQueue = this.countQueue.bind(this);
    this.countQueueAllService = this.countQueueAllService.bind(this);
    this.countByServiceCount = this.countByServiceCount.bind(this);
  }

  async createQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const newQueue = await this.queueService.createQueue(payload);

      res.status(200).json({
        success: true,
        data: newQueue,
      });
    } catch (error) {
      next(error);
    }
  }

  async createQueueDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const newQueueDetail = await this.queueService.createQueueDetail(payload);

      res.status(200).json({
        success: true,
        data: newQueueDetail,
      });
    } catch (error) {
      next(error);
    }
  }

  async countQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const [rawQueryKey] = Object.keys(query).filter(key => key.startsWith('DATE'));
      const rawQueryValue = query[rawQueryKey];
      const dateQuery = `${rawQueryKey}=${rawQueryValue}`;
      const countQueue = await this.queueService.countQueue({
        type_id: Number(query.type_id),
        Date: dateQuery,
      });
      res.status(200).json({ count: countQueue });
    } catch (error) {
      next(error);
    }
  }

  async countQueueAllService(req: Request, res: Response, next: NextFunction) {
    try {
      const countAllService = await this.queueService.countQueueAllService();
      res.status(200).json({ count: countAllService });
    } catch (error) {
      next(error);
    }
  }

  async countByServiceCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_id } = req.params;
      const countByService = await this.queueService.countByServiceCount({ service_id });
      res.status(200).json({ count: countByService });
    } catch (error) {
      next(error);
    }
  }
}
