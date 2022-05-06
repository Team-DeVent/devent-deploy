import { Router } from 'express';
const router = Router();


import * as env from '../controllers/env.ctrl.js';
import { whitelist } from '../middlewares/whitelist.js';


router.post('/', whitelist, env.insert);
router.get('/:hash', whitelist, env.get);
router.get('/', whitelist, env.get);


export default router;