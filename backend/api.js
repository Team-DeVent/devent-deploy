import { Router } from 'express';
const router = Router();

import { check } from './middlewares/token.js';


import webhook from './routes/webhook.js';



router.use('/webhook', webhook);

export default router;