import express from 'express';
import { queueController } from './queue.config';

const router = express.Router();

router.post('/', queueController.createQueue);
router.get('/count', queueController.countQueue);

export const queueRoute = router;
