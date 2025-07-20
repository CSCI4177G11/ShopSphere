import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as consumerCtrl from '../controllers/consumerController.js';
import { requireAuth, requireRole} from '../middleware.auth.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole(['consumer', 'admin']));

router.get('/consumer/profile', consumerCtrl.getConsumerProfile);
router.put(
  '/consumer/profile',
  [ 
    body('storeName').isString().trim().notEmpty().isLength({max:120}),
    body('location').isString().isLength({max: 120}),
    body('logoUrl').isString(),
    body('storeBannerUrl').isString(),
    body('phoneNumber').isString(),
    body('socialLinks').isArray().isOptional(),
  ],
  vendorCtrl.updateVendorProfile
);

router.put('/vendor/settings',
  [

  ],
  vendorCtrl.changeTheme
);

router.put('/vendor/:id/approve',
    [
    param('vendorId').isString().notEmpty(),
    body('isApproved').isBoolean(),
    ],
    vendorCtrl.approval
)

export default router;