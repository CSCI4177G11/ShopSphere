import { Router } from 'express';
import { query } from 'express-validator';
import * as vendorCtrl from '../controllers/vendorController.js';

const router = Router();

// Public endpoint - no authentication required
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString().trim(),
    query('sort').optional().isIn(['name:asc', 'name:desc', 'createdAt:asc', 'createdAt:desc']),
  ],
  vendorCtrl.listPublicVendors
);

export default router;