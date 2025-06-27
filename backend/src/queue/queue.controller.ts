import { NextFunction, Request, Response } from 'express';
import { QueueService } from './core/service/queue.service';
import { ResponseUtils } from '../libs/ResponseUtils';
import { validateBody, validateParams } from '../infrastructure/middleware/validation.middleware';
import {
  queueSchema,
  queueDetailsSchema,
  queueByServiceCountSchema,
} from './core/schema/queu.schema';
import { z } from 'zod';

export class QueueController {
  constructor(private readonly queueService: QueueService) {
    this.createQueue = this.createQueue.bind(this);
    this.createQueueDetail = this.createQueueDetail.bind(this);
    this.createQueueWithDetail = this.createQueueWithDetail.bind(this);
    this.countQueue = this.countQueue.bind(this);
    this.countQueueAllService = this.countQueueAllService.bind(this);
    this.countByServiceCount = this.countByServiceCount.bind(this);
  }

  async createQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const newQueue = await this.queueService.createQueue(req.body);
      ResponseUtils.created(res, newQueue, 'Queue created successfully');
    } catch (error) {
      next(error);
    }
  }

  async createQueueDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const newQueueDetail = await this.queueService.createQueueDetail(req.body);
      ResponseUtils.created(res, newQueueDetail, 'Queue details created successfully');
    } catch (error) {
      next(error);
    }
  }

  async createQueueWithDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { queue: queueData, details: queueDetailsData } = req.body;
      console.log('BACKEND PAYLOAD', queueData, queueDetailsData);
      const result = await this.queueService.createQueueWithDetail(queueData, queueDetailsData);
      ResponseUtils.created(res, result, 'Queue and details created successfully');
    } catch (error) {
      next(error);
    }
  }

  async countQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await this.queueService.countQueue(req.query);
      ResponseUtils.success(res, { count }, 'Queue count retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async countQueueAllService(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await this.queueService.countQueueAllService();
      ResponseUtils.success(res, { count }, 'All service queue count retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async countByServiceCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await this.queueService.countByServiceCount(req.params);
      ResponseUtils.success(res, { count }, 'Service queue count retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const queueValidation = {
  createQueue: validateBody(queueSchema),
  createQueueDetail: validateBody(queueDetailsSchema.array()),
  createQueueWithDetail: validateBody(
    z.object({
      queue: queueSchema,
      details: queueDetailsSchema.array(),
    }),
  ),
  countByServiceCount: validateParams(queueByServiceCountSchema),
};
