import express from 'express';
import { queueController } from './queue.config';

const router = express.Router();

router.post('/create', queueController.createQueue);

export const queueRoute = router;
