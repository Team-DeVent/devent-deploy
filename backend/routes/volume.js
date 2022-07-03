import { Router } from 'express';
const router = Router();


import * as volume from '../controllers/volume.ctrl.js';
import { whitelist } from '../middlewares/whitelist.js';


router.post('/', whitelist, volume.insert);


export default router;