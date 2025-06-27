import express from 'express';
import { serviceController } from './service.config';

const router = express.Router();

router.get('/', serviceController.getService);

export const serviceRoutes = router;
