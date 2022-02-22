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


event.on('clone_repository', (github_url)  => {
    let url = github_url;
    let uuid = uuidv4();

    console.log(`[ + ] Clone '${url}' repository.`)

    
    let child = exec.exec(`git clone ${url} ${uuid} --progress`, {
        cwd: clone_dir
    })

    child.stdout.on('close', code => {
        event.emit("create_image", uuid, url)
    });

});

event.on('create_image', (uuid, url) => {
    console.log(`[ + ] Created '${uuid}' image.`)
    let uuid_replaced = uuid.replaceAll('-','')
    let image_tag = `${uuid_replaced}:2.12`
    docker.buildImage({
        context: `${clone_dir}/${uuid}`,
        src: ['Dockerfile']
    }, {t: image_tag, remote: url}, function (err, response) {
        //console.log(response)
        event.emit("create_container", image_tag, uuid_replaced)
    });
});

event.on("create_container", (image_tag, uuid_replaced) => {
    docker.createContainer({Image: image_tag, name: `${uuid_replaced}-test`}, function (err, container) {
        container.start(function (err, data) {
            console.log(`[ + ] Created '${uuid_replaced}' container.`)

        });
    });
})




export async function receiveWebhookFromGithub (req, res) {
    try {
        let webhook_data = req;
        let github_url = webhook_data.body.repository.clone_url

        let is_valid = await checkWebhookSecret(req)
        console.log(is_valid)

        if (is_valid) {
            event.emit("clone_repository", github_url)
        } else {
            return res.status(401).json({status:0})
        }

    
        res.status(200).json({status:1})
    } catch (error) {
        res.status(500).json({status:0})
    }

}

export function test (req, res) {
    try {
        event.emit("clone_repository", "https://github.com/alpinelinux/docker-alpine.git")

    
        res.status(200).json({status:1})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0})
    }

}