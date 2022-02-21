import { Router } from 'express';
const router = Router();


import { test,receiveWebhookFromGithub } from '../controllers/webhook.ctrl.js';


router.post('/github', receiveWebhookFromGithub);
router.get('/test', test);


export default router;