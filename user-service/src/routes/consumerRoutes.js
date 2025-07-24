import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as consumerCtrl from '../controllers/consumerController.js';
import { requireAuth, requireRole} from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole(['consumer', 'admin']));

router.get('/health', (req, res) => {
  res.json({
    service: 'orders',
    status: 'up',
    uptime_seconds: process.uptime().toFixed(2),
    checked_at: new Date().toISOString(),
    message: 'Order service is operational.',
  });
});


router.post(
  '/consumer/profile',
  [
    body('fullName').isString().notEmpty(),
    body('email').isEmail().withMessage('Valid email required'),
    body('phoneNumber').isString().notEmpty()
  ],
  consumerCtrl.addConsumerProfile
);

router.get('consumer/profile', consumerCtrl.getConsumerProfile);

router.put(
  '/consumer/profile',
  [ 
    body('fullName').isString().notEmpty(),
    body('phoneNumber').isString()
  ],
  consumerCtrl.updateConsumerProfile
);

router.get('/consumer/settings',
  consumerCtrl.getSetting
);

router.put(
  '/consumer/settings',
  [
    body('currency').optional().isString(),
    body('theme').optional().isString()
  ],
  consumerCtrl.changeSetting
);

router.post('/consumer/addresses',
    [
    body('label').isString(),
    body('line').isString(),
    body('city').isString(),
    body('postalCode').isString(),
    body('country').isString()
    ],
    consumerCtrl.addNewAddress
)

router.get('/consumer/addresses', consumerCtrl.getAddresses);

router.put('/consumer/addresses/:id',
    [
    param('id').notEmpty(),
    body('label').isString().notEmpty(),
    body('line').isString().notEmpty(),
    body('city').isString().notEmpty(),
    body('postalCode').isString().notEmpty(),
    body('country').isString().notEmpty()
    ],
    consumerCtrl.updateAddress
)

router.delete('/consumer/addresses/:id',
    [
        param('id').notEmpty()
    ]
,
consumerCtrl.deleteAddress)

export default router;