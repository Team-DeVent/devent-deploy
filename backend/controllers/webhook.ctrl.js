import jwt from 'jsonwebtoken';
import exec from 'child_process';
import EventEmitter from 'events';
import Dockerode from 'dockerode';
import { v4 as uuidv4 } from 'uuid';


import data from '../config/jwt.js';
import gitconfig from '../config/git.js';

import { checkWebhookSecret } from '../services/webhook.serv.js'

let clone_dir = gitconfig.clone_repo_dir;

const event = new EventEmitter();
const docker = new Dockerode(); 


event.on('clone_repository', ()  => {
    let url = 'https://github.com/alpinelinux/docker-alpine.git';
    let uuid = uuidv4();

    console.log(`[ + ] Clone '${url}' repository.`)

    
    let child = exec.exec(`git clone ${url} ${uuid} --progress`, {
        cwd: clone_dir
    })

    child.stdout.on('close', code => {
        event.emit("create_container", uuid, url)
    });

});

event.on('create_container', (uuid, url) => {
    console.log(`[ + ] Created '${uuid}' image.`)
    docker.buildImage({
        context: `${clone_dir}/${uuid}`,
        src: ['Dockerfile']
    }, {t: `${uuid.replaceAll('-','')}:2.12`, remote: url}, function (err, response) {
        //console.log(response)
    });
});

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

export function test (req, res) {
    try {
        event.emit("clone_repository")

    
        res.status(200).json({status:1})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0})
    }

}