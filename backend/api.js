import { Router } from 'express';
const router = Router();


import webhook from './routes/webhook.js';
import env from './routes/env.js';
import volume from './routes/volume.js';



router.use('/webhook', webhook);
router.use('/env', env);
router.use('/volume', volume);


export default router;