import jwt from 'jsonwebtoken';
import data from '../config/jwt.js';

import { checkWebhookSecret } from '../services/webhook.serv.js'

let jwtSecret = data.secret;

export async function receiveWebhookFromGithub (req, res) {
    try {
        let webhook_data = req;

        console.log(webhook_data)

        let is_valid = await checkWebhookSecret(req)
        console.log(is_valid)

    
        res.status(200).json({status:1})
    } catch (error) {
        res.status(500).json({status:0})
    }

}


