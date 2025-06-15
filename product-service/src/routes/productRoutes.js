import { Router } from 'express';
import { body, param, query } from 'express-validator';

import * as productCtrl from '../controllers/productController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole(['vendor', 'admin']),
  [
    body('vendorId').isString().notEmpty(),
    body('name').isString().trim().isLength({ max: 120 }),
    body('description').optional().isString().isLength({ max: 4000 }),
    body('price').isFloat({ min: 0 }),
    body('quantityInStock').isInt({ min: 0 }),
    body('images').isArray({ min: 1 }),
    body('tags').optional().isArray(),
    body('isPublished').optional().isBoolean(),
  ],
  productCtrl.createProduct
);

router.put(
  '/:id',
  requireAuth,
  requireRole(['vendor', 'admin']),
  [
    param('id').isMongoId(),
    body('name').optional().isString().trim().isLength({ max: 120 }),
    body('description').optional().isString().isLength({ max: 4000 }),
    body('price').optional().isFloat({ min: 0 }),
    body('quantityInStock').optional().isInt({ min: 0 }),
    body('images').optional().isArray({ min: 1 }),
    body('tags').optional().isArray(),
    body('isPublished').optional().isBoolean(),
  ],
  productCtrl.updateProduct
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['vendor', 'admin']),
  [param('id').isMongoId()],
  productCtrl.deleteProduct
);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('tags').optional().isString(),
    query('sort').optional().isString(),
  ],
  productCtrl.listProducts
);

router.get(
  '/vendor/:vendorId',
  [
    param('vendorId').isString().notEmpty(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
    query('tags').optional().isString(),
    query('sort').optional().isString(),
  ],
  productCtrl.listProductsByVendor
);

router.get(
  '/:id',
  [param('id').isMongoId()],
  productCtrl.getProductById
);

export default router;
