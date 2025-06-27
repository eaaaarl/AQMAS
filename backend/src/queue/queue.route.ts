import express from 'express';
import { queueController } from './queue.config';
import { queueValidation } from './queue.controller';

const router = express.Router();

// Queue creation routes
router.post('/', queueValidation.createQueue, queueController.createQueue);
router.post('/detail', queueValidation.createQueueDetail, queueController.createQueueDetail);
router.post(
  '/with-detail',
  queueValidation.createQueueWithDetail,
  queueController.createQueueWithDetail,
);

// Queue counting routes
router.get('/allservicecount', queueController.countQueueAllService);
router.get(
  '/byservicecount/:service_id',
  queueValidation.countByServiceCount,
  queueController.countByServiceCount,
);
router.get('/count', queueController.countQueue);

export default router;
