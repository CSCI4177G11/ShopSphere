import { Router } from 'express';
import { body, param } from 'express-validator';

import * as cartCtrl from '../controllers/cartController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();


router.use(requireAuth);
router.use(requireRole(['consumer', 'admin']));

router.get('/', cartCtrl.getCart);

router.post(
  '/items',
  [
    body('productId').isString().notEmpty(),
    body('productName').isString().trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('quantity').optional().isInt({ min: 1 }),
  ],
  cartCtrl.addToCart
);

router.put(
  '/items/:itemId',
  [
    param('itemId').isString().notEmpty(),
    body('quantity').isInt({ min: 1 }),
  ],
  cartCtrl.updateCart
);

router.delete(
  '/items/:itemId',
  [param('itemId').isString().notEmpty()],
  cartCtrl.removeFromCart
);

router.delete('/clear', cartCtrl.clearCart);

router.get('/totals', cartCtrl.getCartTotals);

export default router;
