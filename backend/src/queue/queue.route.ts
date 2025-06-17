import express from 'express';
import { queueController } from './queue.config';

const router = express.Router();

router.post('/', queueController.createQueue);
router.post('/detail', queueController.createQueueDetail);
router.get('/count', queueController.countQueue);
router.get('/allservicecount', queueController.countQueueAllService);
router.get('/byservicecount/:service_id', queueController.countByServiceCount);

export const queueRoute = router;
