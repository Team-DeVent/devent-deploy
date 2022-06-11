import { Router } from 'express';
const router = Router();


import { deploy,receiveWebhookFromGithub } from '../controllers/webhook.ctrl.js';
import { whitelist } from '../middlewares/whitelist.js';


router.post('/github', receiveWebhookFromGithub);
router.post('/deploy', whitelist, deploy);


export default router;