import { Router } from 'express';
const router = Router();


import * as env from '../controllers/env.ctrl.js';
import { whitelist } from '../middlewares/whitelist.js';


router.post('/', whitelist, env.insert);


export default router;