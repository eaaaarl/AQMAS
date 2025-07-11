import express from 'express';
import { configController } from './configuration.config';

const router = express.Router();

router.get('/', configController.getAllConfig);

export const configRoute = router;
