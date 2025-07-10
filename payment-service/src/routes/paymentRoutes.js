// src/routes/paymentRoutes.js
import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';

import {
    createSetupIntent,
    listPaymentMethods,
    detachPaymentMethod,
    createPayment,
    listPayments,
    getPaymentById,
    savePaymentMethod,
    setDefaultPaymentMethod,
} from '../controllers/paymentController.js';

import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Reusable validator-error helper
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    next();
};

const router = Router();

/* -------------------------------------------------------------------------- */
/*  All routes below require a valid JWT                                       */
/* -------------------------------------------------------------------------- */
router.use(requireAuth);

/**
 * POST /api/payments/setup-intent
 * Create a Stripe SetupIntent so the consumer can save a card on file.
 */
router.post('/setup-intent', createSetupIntent);

/**
 * GET  /api/payments/payment-methods
 * List saved payment methods for the authenticated consumer.
 */
router.get('/payment-methods', listPaymentMethods);

/**
 * DELETE /api/payments/payment-methods/:paymentMethodId
 * Detach a saved card.
 */
router.delete(
    '/payment-methods/:paymentMethodId',
    [
        param('paymentMethodId').isString().notEmpty(),
        handleValidationErrors,
    ],
    detachPaymentMethod,
);

/**
 * POST /api/payments
 * Charge the consumer for an order (Stripe PaymentIntent).
 * Body: { orderId, amount, currency, paymentMethodId }
 */
router.post(
    '/',
    [
        body('orderId').isString().notEmpty(),
        body('amount').isInt({ min: 1 }),
        body('currency').isString().isLength({ min: 3, max: 3 }),
        body('paymentMethodId').isString().notEmpty(),
        handleValidationErrors,
    ],
    createPayment,
);

/**
 * GET /api/payments
 * List consumer’s payments (supports simple pagination).
 * Query: ?page=1&limit=10
 */
router.get(
    '/',
    [
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
        handleValidationErrors,
    ],
    listPayments,
);

/**
 * GET /api/payments/:paymentId
 * Fetch one payment record by Mongo _id.
 */
router.get(
    '/:paymentId',
    [
        param('paymentId').isMongoId().withMessage('Invalid payment id'),
        handleValidationErrors,
    ],
    getPaymentById,
);

/**
 * POST /api/payments/consumer/payment-methods
 * Save a Stripe payment method to the consumer
 */
router.post(
    '/consumer/payment-methods',
    [
        body('paymentMethodToken').isString().notEmpty(),
        body('billingDetails').optional().isObject(),
        handleValidationErrors,
    ],
    savePaymentMethod,
);

/**
 * PUT /api/payments/consumer/payment-methods/:id/default
 * Set a saved card as the default for the Stripe customer
 */
router.put(
    '/consumer/payment-methods/:id/default',
    [
        param('id').isString().notEmpty(),
        handleValidationErrors,
    ],
    setDefaultPaymentMethod,
);

/**
 * (Optional) Admin-only endpoint to list all payments across consumers.
 * Uncomment if/when you implement the controller.
 */
// router.get(
//   '/admin/all',
//   requireRole(['admin']),
//   [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 100 }), handleValidationErrors],
//   listAllPayments,
// );

export default router;
