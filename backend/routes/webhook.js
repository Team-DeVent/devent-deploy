import { Router } from 'express';
const router = Router();


import { receiveWebhookFromGithub } from '../controllers/webhook.ctrl.js';


router.get('/github', receiveWebhookFromGithub);


export default router;