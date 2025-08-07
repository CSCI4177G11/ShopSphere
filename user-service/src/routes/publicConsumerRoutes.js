import { Router } from 'express';
import { query, param } from 'express-validator';
import * as consumerCtrl from '../controllers/consumerController.js';

const router = Router();

// Public endpoint - no authentication required
router.get(
  '/count',
  consumerCtrl.getConsumerCount
);


export default router;