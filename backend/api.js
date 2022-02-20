import { Router } from 'express';
const router = Router();

import { check } from './middlewares/token.js';


import users from './routes/users.js';



router.use('/users', users);

export default router;