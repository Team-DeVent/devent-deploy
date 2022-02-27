import exec from 'child_process';
import EventEmitter from 'events';
import Dockerode from 'dockerode';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';


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
    fs.readFile(`${clone_dir}/${uuid}/package.json`, 'utf8', (error, json) => {
        console.log(`[ + ] Get package.json`)
        let uuid_replaced = uuid.replaceAll('-','')
        let json_data, package_name_replaced, image_tag, version;

        if (error) {
            image_tag = `${uuid_replaced}:1.0`
        } else {
            json_data = JSON.parse(json);
            package_name_replaced = json_data.name.replaceAll('-','')
            version = json_data.version.split(".")
            image_tag = `${package_name_replaced}:${version[0]+"."+version[1]}`
        }

        let child = exec.exec(`docker build --tag ${image_tag} .`, {
            cwd: `${clone_dir}/${uuid}/`
        })
    
        child.stdout.on('close', code => {
            console.log(`[ + ] Created '${image_tag}' image.`)

            event.emit("create_container", image_tag, uuid_replaced)
        });

        /*
        docker.buildImage({
            context: `${clone_dir}/${uuid}`,
            src: ['Dockerfile']
        }, {t: image_tag}, function (err, response) {

        });
        */
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
        event.emit("clone_repository", "https://github.com/Team-DeVent/devent-imageserver.git")

    
        res.status(200).json({status:1})
    } catch (error) {
        console.log(error)
        res.status(500).json({status:0})
    }

}