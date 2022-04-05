import { Router } from 'express';
const router = Router();


import { test,receiveWebhookFromGithub } from '../controllers/webhook.ctrl.js';
import { whitelist } from '../middlewares/whitelist.js';


router.post('/github', receiveWebhookFromGithub);
router.get('/test', whitelist, test);


export default router;