import jwt from 'jsonwebtoken';
import data from '../config/setting.js';
import crypto from 'crypto';

let webhook_secret = data.GITHUB_SECRET;
let enable_users = data.ENABLE_USERS;

export async function checkWebhookSecret(req) {
    try {
        let hmac = crypto.createHmac('sha1', webhook_secret);
        let digest = `sha1=${hmac.update(JSON.stringify(req.body)).digest('hex')}`;

        let buffer_server_signature = Buffer.from(digest, 'utf8');
        let buffer_github_signature = Buffer.from(req.headers['x-hub-signature'], 'utf8');
      
        const check = await new Promise((resolve, reject) => {
            if (crypto.timingSafeEqual(buffer_server_signature, buffer_github_signature)) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
      
        return check
    } catch (err) {
        console.log(err)
        throw Error(err)
    }
}

export async function checkAuthorization(github_user_id) {
    try {
        let result_boolean = false;

        if(enable_users.indexOf(github_user_id) >= 0)  {
            result_boolean = true;
        }

        return result_boolean
    } catch (err) {
        console.log(err)
        throw Error(err)
    }
}
