import { Router } from 'express';
import { whitelist } from '../../backend/middlewares/whitelist.js';

const router = Router();

router.get('/', whitelist, function(req, res) {
    res.render('index')
});

router.get('/env', whitelist, function(req, res) {
    res.render('env')
});

router.get('/volume', whitelist, function(req, res) {
    res.render('volume')
});

export default router;