// src/routes/orderRoutes.js
import { Router } from 'express';
import { body, param, query } from 'express-validator';

import * as orderCtrl from '../controllers/orderController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();


router.post(
  '/',
  requireAuth,
  requireRole('consumer'),
  [
    body('paymentId').isString().notEmpty(),             
    body('orderItems').isArray({ min: 1 }),
    body('shippingAddress').isObject().notEmpty(),
  ],
  orderCtrl.createOrder
);


router.get(
  '/',
  requireAuth,
  requireRole(['vendor', 'admin']),
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('orderStatus').optional().isString(),
    query('dateFrom').optional().isISO8601(),
    query('dateTo').optional().isISO8601(),
  ],
  orderCtrl.listOrders
);

router.get(
  '/user/:userId',
  requireAuth,
  [
    param('userId').isString().notEmpty(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  orderCtrl.listOrdersByUser
);


router.get(
  '/:id',
  requireAuth,
  [param('id').isMongoId()],
  orderCtrl.getOrderById
);

router.put(
  '/:id/status',
  requireAuth,
  requireRole(['vendor', 'admin']),
  [
    param('id').isMongoId(),
    body('orderStatus').isString().notEmpty(),           
  ],
  orderCtrl.updateOrderStatus
);

router.post(
  '/:id/cancel',
  requireAuth,
  [param('id').isMongoId(), body('reason').optional().isString()],
  orderCtrl.cancelOrder
);

router.get(
  '/:id/tracking',
  requireAuth,
  [param('id').isMongoId()],
  orderCtrl.getOrderTracking
);

export default router;
