import {Router} from 'express';
const controller = reauire('../controllers/authController');

const route = Router();

route.post('/login', controller.login);
router.post("/register", controller.register);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isString().notEmpty(),
  ],
  controller.login
);

router.post(
  '/register',
  [
    body('username').isEmail().notEmpty(),
    body('email').isString().withMessage('Valid email required'),
    body('password').isString().notEmpty(),
    body('role').isString().notEmpty(),
    
  ],
  controller.login
);

export default router;