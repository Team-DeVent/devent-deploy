import jwt from 'jsonwebtoken';
import data from '../config/jwt.js';

import { checkWebhookSecret } from '../services/webhook.serv.js'
import { cloneRepository } from '../services/git.serv.js'
import { createContainer } from '../services/docker.serv.js'



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

export async function test (req, res) {
    try {
            
        let url = 'https://github.com/alpinelinux/docker-alpine.git'
        let branch = 'main'
        let exec_data = await cloneRepository({url, branch})
        //let dockers = await createContainer()
        console.log(exec_data)

    
        res.status(200).json({status:1})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0})
    }

}