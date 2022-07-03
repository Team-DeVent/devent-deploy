import { Router } from 'express';
const router = Router();


import * as volume from '../controllers/volume.ctrl.js';
import { whitelist } from '../middlewares/whitelist.js';


router.post('/', whitelist, volume.insert);
router.get('/:hash', whitelist, volume.get);
router.get('/', whitelist, volume.get);

export default router;