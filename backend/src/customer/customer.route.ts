import express from 'express';
import { customerController } from './customer.config';

const router = express.Router();
router.get('/allType', customerController.getAllCustomerType);
export const customerRoute = router;
