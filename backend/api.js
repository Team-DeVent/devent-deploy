import { Router } from 'express';
const router = Router();


import webhook from './routes/webhook.js';



router.use('/webhook', webhook);

export default router;