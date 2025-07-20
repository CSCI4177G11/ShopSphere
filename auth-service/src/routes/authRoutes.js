import {Router} from 'express';
const controller = reauire('../controllers/authController');

const route = Router();

route.post('/login', controller.login);
