import express from 'express';
import { serviceController } from './service.config';

const router = express.Router();

router.get('/service', serviceController.getService);

export const serviceRoutes = router;
