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
    body('fullName').isString().notEmpty(),
    body('phoneNumber').isString()
  ],
  consumerCtrl.updateConsumerProfile
);

router.get('/consumer/settings',
  consumerCtrl.getTheme
);

router.put('/consumer/settings',
    [
        body('isApproved').isBoolean()
    ],
    consumerCtrl.changeTheme
)

router.post('consumer/addresses',
    [
    body('label').isString().isRequired(),
    body('line').isString().isRequired(),
    body('city').isString().isRequired(),
    body('postalCode').isString().isRequired(),
    body('country').isString().isRequired()
    ],
    consumerCtrl.addNewAddress
)

router.get('/consumer/addresses', consumerCtrl.getAddresses);

router.put('consumer/addresses/id:',
    [
    param('addressId').isRequired(),
    body('label').isString().isRequired(),
    body('line').isString().isRequired(),
    body('city').isString().isRequired(),
    body('postalCode').isString().isRequired(),
    body('country').isString().isRequired()
    ],
    consumerCtrl.updateAddress
)

router.delete('/consumer/addresses/id:',
    [
        param('addressId').isRequired()
    ]
)
consumerCtrl.deleteAddress

export default router;