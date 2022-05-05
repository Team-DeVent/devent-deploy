import { Router } from 'express';
const router = Router();


import webhook from './routes/webhook.js';
import env from './routes/env.js';



router.use('/webhook', webhook);
router.use('/env', env);


export default router;